//https://www.kontests.net/api
const axios = require("axios");
const lodash = require("lodash");
const url = "https://www.kontests.net/api/v1/";

const utc_To_ist = (contestData) => {
  contestData.forEach((contest) => {
    contest.start_time = new Date(contest.start_time).toString();
    contest.end_time = new Date(contest.end_time).toString();
    contest.start_time = contest.start_time.split(" ").splice(0, 5).join(" ");
    contest.end_time = contest.end_time.split(" ").splice(0, 5).join(" ");
  });

  return contestData;
};

const getTime = (contestData) => {
  contestData.forEach((contest) => {
    if (parseInt(contest.duration.split(" ")[0]) <= 8) {
      contest.start_time = contest.start_time.split(" ")[4];
      contest.end_time = contest.end_time.split(" ")[4];
    }
  });
  return contestData;
};

const duration_status_conversion = (contestData) => {
  contestData.forEach((contest) => {
    contest.duration = `${parseFloat(contest.duration / 3600)} hrs`;
    if (contest.status === "CODING") contest.status = "running";
    else contest.status = "not started yet";
  });

  return contestData;
};

const get_in_24_hours_contests = (currentContestDetails, contestData) => {
  let in_24_hours_contests = [];
  if (currentContestDetails) {
    contestData.forEach((contest) => {
      if (contest.in_24_hours == "Yes" || contest.status === "running")
        in_24_hours_contests.push(contest);
    });
    return in_24_hours_contests;
  } else {
    return contestData;
  }
};

exports.supportedSites = async () => {
  let { data: allSites } = await axios.get(`${url}sites`);
  return sites;
};

exports.showContestDeatils = async (
  isFormat,
  currentContestDetails,
  platform
) => {
  let contests = await getContestDetails(currentContestDetails, platform);
  // if (currentContestDetails) contests = getTime(contests);
  let newContests = [];
  contests.forEach((contest, id) => {
    newContests.push(contest);
  });
  if (!isFormat) return newContests;
};

const getContestDetails = async (currentContestDetails, platform) => {
  let { data: contestData } = await axios.get(`${url}${platform}`);
  contestData = utc_To_ist(contestData);
  contestData = duration_status_conversion(contestData);
  const in_24_hours_contest = get_in_24_hours_contests(
    currentContestDetails,
    contestData
  );
  return in_24_hours_contest;
};
