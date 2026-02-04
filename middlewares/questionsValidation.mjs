export const validateCreateQuestion = (req, res, next) => {
    const { title, description, category } = req.body

    if (!title) {
        return res.status(400).json({ message: "กรุณาเพิ่ม title" })
    }
    if (!description) {
        return res.status(400).json({ message: "กรุณาเพิ่ม description" })
    }
    if (!category) {
        return res.status(400).json({ message: "กรุณาเพิ่ม category" })
    }
    next()
}

export const validateUpdateQuestion = (req, res, next) => {
    const { title, description, category } = req.body
    if (!title && !description && !category) {
        return res.status(400).json({
            message: "กรุณาส่งอย่างน้อย 1 field เพื่อแก้ไข"
        })
    }
    next()
}

export const validateSearchQuestion = (req, res, next) => {
  const { title, category } = req.query

  if (!title && !category) {
    return res.status(400).json({
      message: "กรุณาระบุ title หรือ category อย่างน้อย 1 อย่าง"
    })
  }

  next()
}

export const validateCreateAnswer = (req, res, next) => {
  const { content } = req.body

  if (!content) {
    return res.status(400).json({
      message: "กรุณาเพิ่ม content"
    })
  }
    if (content.length > 300) {
    return res.status(400).json({
      message: "content ต้องไม่เกิน 300 ตัวอักษร"
    })
  }

  next()
}