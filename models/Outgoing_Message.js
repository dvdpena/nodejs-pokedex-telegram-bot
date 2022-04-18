module.exports = class Message{
    constructor(chat_id, text, parse_mode = "Markdown", entities	,disable_web_page_preview = true ,disable_notification	,protect_content, reply_to_message_id, allow_sending_without_reply, reply_markup = { remove_keyboard: true }){
        
    this.chat_id = chat_id
    this.text = text
    this.parse_mode = parse_mode
    if (entities != undefined) this.entities = entities
    if (disable_web_page_preview != undefined)this.disable_web_page_preview = disable_web_page_preview
    if (disable_notification != undefined)this.disable_notification = disable_notification
    if (protect_content != undefined)this.protect_content = protect_content
    if (reply_to_message_id != undefined)this.reply_to_message_id = reply_to_message_id
    if (allow_sending_without_reply != undefined)this.allow_sending_without_reply = allow_sending_without_reply
    this.reply_markup = reply_markup
    }
}