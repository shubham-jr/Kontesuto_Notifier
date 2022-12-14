//https://www.kontests.net/api
const axios = require("axios");
const url = "https://www.kontests.net/api/v1/";

const utc_To_ist = (contestData) => {
  contestData.forEach((contest) => {
    contest.start_time = convertDateFormat(
      new Date(contest.start_time).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      })
    );
    contest.end_time = convertDateFormat(
      new Date(contest.end_time).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      })
    );
  });

  return contestData;
};

const convertDateFormat = (date) => {
  const dateArray = date.split("/");
  return [dateArray[1], dateArray[0], dateArray[2]].join("/");
};

const duration_status_conversion = (contestData) => {
  contestData.forEach((contest) => {
    contest.duration = `${parseFloat(contest.duration / 3600)} hrs`;
    if (contest.status === "CODING") contest.status = "running";
    else contest.status = "not started yet";
  });

  return contestData;
};

const get_in_24_hours_contests = (isCurrentContestDetails, contestData) => {
  let in_24_hours_contests = [];
  if (isCurrentContestDetails) {
    contestData.forEach((contest) => {
      if (contest.in_24_hours == "Yes" || contest.status === "running")
        in_24_hours_contests.push(contest);
    });
    return in_24_hours_contests;
  } else {
    return contestData;
  }
};

exports.showContestDeatils = async (currentContestDetails, platform) => {
  let contests = await getContestDetails(currentContestDetails, platform);
  let newContests = [];
  contests.forEach((contest, id) => {
    newContests.push(contest);
  });
  return newContests;
};

const getContestDetails = async (currentContestDetails, platform) => {
  let { data: contestData } = await axios.get(`${url}${platform}`);
  contestData = utc_To_ist(contestData);
  contestData = duration_status_conversion(contestData);
  const in_24_hours_contest = get_in_24_hours_contests(
    currentContestDetails,
    contestData
  );
  console.log(in_24_hours_contest);
  return in_24_hours_contest;
};
