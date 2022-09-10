module.exports = function makeProps(
  title,
  description,
  color,
  contestData,
  platform,
  iconURL,
  url
) {
  let props = {
    setTitle: title,
    color,
    author: "Kontesuto Notifier",
    iconURL,
    url,
    setDescription: description,
    setThumbnail: "",
    value: "",
    platform,
  };
  contestData.forEach((contest, contestId) => {
    props.value += `

Contest ***${contestId}***

***name : ${contest.name}***

***start_time : ${contest.start_time}***

***end_time : ${contest.end_time}***

***duration : ${contest.duration}***

***url : ${contest.url}***

***status : ${contest.status}***
      `;
  });

  return props;
};
