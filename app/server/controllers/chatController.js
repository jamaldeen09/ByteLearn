import User from "../models/User.js"

export const getFriends = async(req, res) => {
    try {
        if (!req.user.userId)
            return res.status(400).send({ success: false, msg: "Unauthorized Access" })

        const exsistingAcc = await User.findById(req.user.userId).populate({
            path: "friends",
            ref: "User"
        });
        if (!exsistingAcc)
            return res.status(404).send({ success: false, msg: "Your account does not exsist please login" })

        const friendPayload = exsistingAcc.friends.forEach((friend) => {
            return {
                friendName: friend.fullName,
                friendImageUrl: friend.avatar,
                isOnline: friend.isOnline,
                lastSeen: friend.lastSeen,
            }
        })

        return res.status(200).send({ success: true, payload: friendPayload })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, msg: "Server Error" })
    }
} 

export const getNotifications = async (req, res) => {
    try {
   
        if (!req.user.userId)
            return res.status(401).send({ success: false, msg: "Unauthorized Access" })

        const exsistingAcc = await User.findById(req.user.userId).populate({
            path: "notifications",
            model: "Notification",
            populate: [
              {
                path: "sender",
                model: "User",
                select: "fullName avatar" 
              },
              {
                path: "receiver", 
                model: "User",
                select: "fullName avatar"
              }
            ]
          });
       
          res.status(200).send({ success: true, notifications: exsistingAcc.notifications})
        
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, msg: "Server Error" })
    }
}     