const getOtherMembers = (members, userId) => {
  try {
    return members.find(member => member._id.toString() !== userId.toString());
  } catch (error) {
    console.log(error)
  }
}


const deleteFilesFromCloudinary = async (publicIds) => {
  try {

  } catch (error) {
    console.log(`Error while deleting files from cloudinary : ${error}`);
  }
}

export { getOtherMembers, deleteFilesFromCloudinary }
