/**
 * echo notifications
 */
class Echo {
  /**
   * send  notifications
   * @param {int} receiverId - Status code
   * @param {object} data - Data
   * @param {array} connectedClients -connectedClients
   * @param {object} io -io
   * @param {string} type -type
   * @returns {void}
   */
  sendNotification(receiverId, data, connectedClients, io, type) {
    if (!receiverId) {
      io.emit(type, data);
    } else if (connectedClients[receiverId.toString()]) {
      connectedClients[receiverId.toString()].forEach(element => {
        io.to(element).emit(type, data);
      });
    }
  }
}

export default new Echo();
