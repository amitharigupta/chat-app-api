


const emitEvent = (req, event, users, data) => {
  try {
    console.log(`Emmiting Event: ${event}`);
  } catch (error) {
    console.log(`Error while emitting event: ${error}`);
  }
}

export {
  emitEvent
}
