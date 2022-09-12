const contestController = require("./../controllers/contestControllers");
const createEmdeb = require("./../embed/embeds");
const makeProps = require("./../utils/makeProps");
const catchAsync = require("./../utils/catchAsync");
const platformMapped = require("./../utils/platformsMapped");
const platformUrls = require("./../utils/allPlatformsUrl");
const allPlatformsUrl = require("./../utils/allPlatformsUrl");
const helper = require("./../utils/helper");
const { help } = require("./../utils/allPlatformsUrl");
class Notifier {
  constructor(client) {
    this.client = client;
    this.channelsToNotify = [];
  }
  getChannelsToNotify() {
    console.log(this.channelsToNotify);
  }
  isChannelCorrect(channelId) {
    let flag = false;
    this.channelsToNotify.forEach((id) => {
      if (id == channelId) flag = true;
    });
    return flag;
  }
  createChannelIfNotPresent() {
    this.client.guilds.cache.forEach((guild) => {
      let isChannelPresent = false;
      guild.channels.cache.find((c) => {
        if (c.name === "kontesuto_notifier") {
          if (this.channelsToNotify.includes(c.id) === false) {
            this.channelsToNotify.push(c.id);
          }
          isChannelPresent = true;
        }
      });
      if (!isChannelPresent) {
        guild.channels
          .create({ name: "kontesuto_notifier" })
          .then((newChannel) => {
            this.channelsToNotify.push(newChannel.id);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }

  passProps = () => {};

  broadcastContestDetails = catchAsync(async () => {
    const codeforcesContests = await contestController.showContestDeatils(
      true,
      "codeforces"
    );
    const codeChefContests = await contestController.showContestDeatils(
      true,
      "code_chef"
    );
    const propsOfProps = {
      title: "Contests In 24hrs",
      description:
        "Hi folks, feeling bored?? Mee too. let's participate in contests and increase our problem solving skills",
      color: "0x0099ff",
    };
    const propsOfCodechef = makeProps(
      propsOfProps.title,
      propsOfProps.description,
      propsOfProps.color,
      codeChefContests,
      "Codechef",
      allPlatformsUrl.codechef.iconUrl,
      allPlatformsUrl.codechef.url
    );
    const propsOfCodeforces = makeProps(
      propsOfProps.title,
      propsOfProps.description,
      propsOfProps.color,
      codeforcesContests,
      "Codeforces",
      allPlatformsUrl.codeforces.iconUrl,
      allPlatformsUrl.codeforces.url
    );
    let embedOfCodechef, embedOfCodeforces;
    console.log(this.channelsToNotify);
    if (codeChefContests.length !== 0 && this.channelsToNotify.length !== 0) {
      embedOfCodechef = createEmdeb(propsOfCodechef);
      this.channelsToNotify.forEach((id) => {
        const channel = this.client.channels.cache.get(`${id}`);
        if (channel) channel.send({ embeds: [embedOfCodechef] });
      });
    }
    if (codeforcesContests.length !== 0 && this.channelsToNotify.length !== 0) {
      embedOfCodeforces = createEmdeb(propsOfCodeforces);
      this.channelsToNotify.forEach((id) => {
        const channel = this.client.channels.cache.get(`${id}`);
        channel.send({ embeds: [embedOfCodeforces] });
      });
    }
  });

  onPlatform = async (message, platformName, mainCommand) => {
    const isCurrentContest = mainCommand === "all" ? false : true;

    const platformContests = await contestController.showContestDeatils(
      isCurrentContest,
      platformMapped[platformName]
    );

    if (platformContests.length === 0) {
      this.noContestReply(message, platformName);
      return;
    }

    const propsOfProps = {
      title: mainCommand ? "Upcoming Contests" : "Contests In 24hrs",
      description: "These are the contests of " + platformName,
      color: "0x0099ff",
    };
    let totalContests = platformContests.length;
    const embedLimit = 3;
    // embed message limit is 6000b
    if (totalContests > embedLimit) {
      totalContests = parseInt(
        totalContests / embedLimit + (totalContests % embedLimit ? 1 : 0)
      );
    } else totalContests = 1;
    let embedOfPlatform = [];
    for (let i = 0; i < totalContests; i++) {
      if (i > 5) break;
      let start = embedLimit * i;
      let end =
        start + embedLimit - 1 > platformContests.length - 1
          ? platformContests.length - 1
          : start + embedLimit - 1;
      let platformContestsInTriplets = [];
      platformContests.forEach((contest, id) => {
        if (id >= start && id <= end) platformContestsInTriplets.push(contest);
      });
      const propsOfPlatform = makeProps(
        propsOfProps.title,
        propsOfProps.description,
        propsOfProps.color,
        platformContestsInTriplets,
        platformName,
        platformUrls[`${platformName}`].iconUrl,
        platformUrls[`${platformName}`].url
      );

      embedOfPlatform.push(createEmdeb(propsOfPlatform));
    }
    this.reply(message, embedOfPlatform);
  };

  onMessage = () => {
    this.client.on("messageCreate", async (message) => {
      if (!this.isChannelCorrect(message.channelId)) return;
      let command = message.content.toLocaleLowerCase().split(" ");
      if (command[0] !== "!") return;
      if (helper.allPlatforms.includes(command[1]))
        this.onPlatform(message, command[1], command[2]);
      else if (command[1] === "help") this.onHelp(message);
    });
  };

  reply = (message, embedOfPlatform) => {
    message.reply({ embeds: embedOfPlatform });
  };

  noContestReply = (message, platform) => {
    message.reply(
      `*** No contest on ${platform} in 24 hours. Try another platform :smiley:***`
    );
  };

  onHelp(message) {
    const platformName = "help";
    const propsOfProps = {
      title: "Welcome to help center",
      description: "Listed all the commands and supported coding platforms",
      color: "0x0099ff",
    };
    const propsOfHelp = makeProps(
      propsOfProps.title,
      propsOfProps.description,
      propsOfProps.color,
      [],
      platformName,
      platformUrls[`${platformName}`].iconUrl,
      platformUrls[`${platformName}`].url
    );

    propsOfHelp.value = helper.helpMessage;

    const helpEmbed = [createEmdeb(propsOfHelp)];
    this.reply(message, helpEmbed);
  }
}
module.exports = Notifier;
