import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateCreateQuestion, validateUpdateQuestion, validateSearchQuestion, validateCreateAnswer } from "../middlewares/questionsValidation.mjs";

const questionRouter = Router()

questionRouter.post("/", validateCreateQuestion, async (req, res) => {
    try {
        const { title, description, category } = req.body

        await connectionPool.query(`insert into questions (title,description,category) 
      values ($1, $2, $3)`,
            [
                title,
                description,
                category
            ])
        return res.status(201).json(
            { message: "Question created successfully." }
        );
    } catch (error) {
        return res.status(500).json({ message: "Unable to create question." })
    }
})

questionRouter.get("/", async (req, res) => {
    try {
        const result = await connectionPool.query(`select * from questions`)
        return res.status(200).json({ data: result.rows })
    } catch (error) {
        return res.status(500).json({ message: "Unable to fetch questions." })
    }
})

questionRouter.get("/search", validateSearchQuestion, async (req, res) => {
    try {
        const { title, category } = req.query

        const titleParam = title ? `%${title}%` : null
        const categoryParam = category ? `%${category}%` : null
        const result = await connectionPool.query(`
      select * from questions 
      where (title ILIKE $1 or $1 is null) 
      and 
      (category ILIKE $2 or $2 is null)`, [titleParam, categoryParam])
        return res.status(200).json(result.rows)
    } catch (error) {
        return res.status(500).json({ message: "Unable to fetch questions." })
    }
})

questionRouter.get("/:questionId", async (req, res) => {
    try {
        const questionId = req.params.questionId
        const result = await connectionPool.query(`select * from questions where id = $1`, [questionId])
        if (!result.rows[0]) {
            return res.status(404).json({ message: "Question not found." })
        }
        return res.status(200).json(result.rows[0])
    } catch (error) {
        return res.status(500).json({ message: "Unable to fetch questions." })
    }
})

questionRouter.put("/:questionId", validateUpdateQuestion, async (req, res) => {
    try {
        const questionId = req.params.questionId
        const { title, description, category } = req.body
        const result = await connectionPool.query(`
      update questions 
      set 
        title = COALESCE($2, title),
        description = COALESCE($3, description),
        category = COALESCE($4, category)
      where id = $1
      RETURNING *
      `, [questionId, title, description, category])
        if (!result.rows[0]) {
            return res.status(404).json({ message: "Question not found." })
        }
        return res.status(200).json({ message: "Question updated successfully." })
    } catch (error) {
        return res.status(500).json({ message: "Unable to update question." })
    }
})

questionRouter.delete("/:questionId", async (req, res) => {
    const client = await connectionPool.connect()

    try {
        const { questionId } = req.params

        await client.query("BEGIN")

        const questionResult = await client.query(
            "select id from questions where id = $1",
            [questionId]
        )

        if (questionResult.rowCount === 0) {
            await client.query("ROLLBACK")
            return res.status(404).json({
                message: "Question not found."
            })
        }

        await client.query(
            "delete from answers where question_id = $1",
            [questionId]
        )

        await client.query(
            "delete from questions where id = $1",
            [questionId]
        )

        await client.query("COMMIT")

        return res.status(200).json({
            message: "Question and related answers deleted successfully."
        })

    } catch (error) {
        await client.query("ROLLBACK")
        console.error(error)

        return res.status(500).json({
            message: "Unable to delete question."
        })
    } finally {
        client.release()
    }
})

questionRouter.post("/:questionId/answers", validateCreateAnswer, async (req, res) => {
    try {
        const questionId = req.params.questionId
        const { content } = req.body

        const result = await connectionPool.query(
            "select id from questions where id = $1",
            [questionId]
        )

        if (!result.rows.length) {
            return res.status(404).json({
                message: "Question not found."
            })
        }

        await connectionPool.query(`
        insert into answers (question_id,content) 
        values ($1, $2)`,
            [questionId, content])
        return res.status(201).json(
            { message: "Answer created successfully." }

        );
    } catch (error) {
        return res.status(500).json({ message: "Unable to create answers." })
    }
})

questionRouter.get("/:questionId/answers", async (req, res) => {
    try {
        const { questionId } = req.params

        const questionResult = await connectionPool.query(
            `select id from questions where id = $1`,
            [questionId]
        )

        if (questionResult.rowCount === 0) {
            return res.status(404).json({
                message: "Question not found."
            })
        }

        const answerResult = await connectionPool.query(
            `
      select *
      from answers
      where question_id = $1
      `,
            [questionId]
        )

        return res.status(200).json({
            data: answerResult.rows
        })

    } catch (error) {

        return res.status(500).json({
            message: "Unable to fetch answers."
        })
    }
})

questionRouter.delete("/:questionId/answers", async (req, res) => {
    try {
        const { questionId } = req.params

        const questionResult = await connectionPool.query(
            "select * from questions where id = $1",
            [questionId]
        )

        if (questionResult.rowCount === 0) {
            return res.status(404).json({
                message: "Question not found."
            })
        }

        await connectionPool.query(
            "delete from answers where question_id = $1",
            [questionId]
        )

        return res.status(200).json({
            message: "All answers for the question have been deleted successfully."
        })

    } catch (error) {
        return res.status(500).json({
            message: "Unable to delete answers."
        })
    }
})

export default questionRouter