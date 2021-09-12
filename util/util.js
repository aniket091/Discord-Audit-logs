
module.exports = {
  format(text, number) {
    text = text.slice(0, number)

    return text + '...';
  },

  channelType(type) {
    let channelType;

    switch(type) {
      case 'GUILD_TEXT':
        channelType = 'Text Channel'
        break;
      case 'GUILD_VOICE':
        channelType = 'Voice Channel'
        break;  
      case 'GUILD_CATEGORY':
        channelType = 'Category Channel'
        break;  
      case 'GUILD_NEWS':
        channelType = 'Announcement Channel'
        break;   
      case 'GUILD_STORE':
        channelType = 'Store Channel'
        break; 
      case 'GUILD_STAGE_VOICE':
        channelType = 'Stage Channel'
        break;
      default:
        channelType = 'UnKnown Channel'
    }

    return channelType;
  },
}