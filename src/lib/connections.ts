const CLOSING_STATE = 2;
const CLOSED_STATE = 3;
declare var conns;
conns = {};

class Connections {
    addConnection(ws) {
        if (!conns[ws.protocol]) {
            conns[ws.protocol] = [];
        }

        conns[ws.protocol].push(ws);
    }

    private removeInactiveByChannel(userId) {
        if (!conns[userId]) {
            return;
        }

        conns[userId].forEach((ws, index) =>{
            if (ws.readyState === CLOSED_STATE || ws.readyState === CLOSING_STATE) {
                conns[userId].splice(index, 1);
            }
        })
    }

    getActiveByChannel(channelId) {
        this.removeInactiveByChannel(channelId);

        return conns[channelId] || [];
    }
}

module.exports = new Connections();
