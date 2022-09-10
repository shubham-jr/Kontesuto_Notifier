const { EmbedBuilder } = require("discord.js");
module.exports = function createEmbded(props) {
  const example = new EmbedBuilder()
    .setColor(`${props.color}`)
    .setTitle(`${props.setTitle}`)
    // .setURL("#")
    .setAuthor({
      name: `${props.platform}`,
      iconURL: `${props.iconURL}`,
      url: `${props.url}`,
    })
    .setDescription(`${props.setDescription}`)
    // .setThumbnail(`${props.setThumbnail}`)
    .addFields({
      name: `${props.author}
          `,
      value: `${props.value}`,
      inline: true,
    });

  return example;
};
