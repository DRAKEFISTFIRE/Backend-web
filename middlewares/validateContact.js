export const validateContact = (
  req,
  res,
  next
) => {

  const { client, project } = req.body;

  if (!client?.name) {
    return res.status(400).json({
      message: "Name is required"
    });
  }

  if (!client?.email) {
    return res.status(400).json({
      message: "Email is required"
    });
  }

  if (!project?.description) {
    return res.status(400).json({
      message: "Description is required"
    });
  }

  next();
};