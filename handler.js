'use strict';
const request = require("superagent")

const slackUrl = process.env.SLS_SLACK_URL
const setting = {
    icon_emoji: process.env.SLS_SLACK_ICONEMOJI || ":aim:",
    username: process.env.SLS_SLACK_USERNAME || "Amy"
};

const slack = (channel,text,attachments)=>{
    const query = Object.assign(setting,{channel,text})
    if(attachments){
        query.attachments = attachments
    }
    return new Promise((resolve)=>{
        request
            .post(slackUrl)
            .send(query)
            .end(function(err, res){
                if(res){
                    resolve(res) // must resolve
                }else{
                    throw err;
                }
            })
    })
}

module.exports.slack = function(event, context, cb) {
    // console.log('Event received: ' + JSON.stringify(event));
    let records = event.Records;

    let pList = [];
    if(records !== undefined && records.length > 0) {
        // let rec = records[0];
        // let message = 'Message on *' + rec.Sns.TopicArn + '*: ' + JSON.stringify(rec.Sns.Message, null, ' ');

        records.forEach(({Sns})=>{
            if(Sns){
                const {text,attachments,channel} = JSON.parse(Sns.Message)
                pList.push(slack(channel,text,attachments))
            }
        });
        if(pList.length){
            Promise.all(pList).then((resList)=>{
                resList.forEach((res)=>{
                    if(res.error){
                        console.log(res.request._data)
                        console.error("Message failed",res.error)
                    }
                })
                cb(null,{message: 'posted to slack'})
            }).catch((err)=>{
                cb(err)
            })
        }else{
            throw new Error("no Sns Message Recieved")
        }
    } else {
        cb(new Error('No SNS records found'));
    }
};