const getOtherMembers = (members, userId) => {
  try {
    return members.find(member => member._id.toString() !== userId.toString());
  } catch (error) {
    console.log(error)
  }
}

export { getOtherMembers }
