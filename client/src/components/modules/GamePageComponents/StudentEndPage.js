import React, { useState, useEffect } from "react";
/**
 * student end page after the game ends
 *
 * @param {string} _id user _id
 * @param {object} gameState game state
 * @param {string} gameMode game mode
 */
const StudentEndPage = (props) => {
  const [fadePage, setFadePage] = useState("");
  const [displayData, setDisplayData] = useState([]);
  const [showDisplayData, setShowDisplayData] = useState(false);

  // convert to time
  const convertToTime = (seconds) => {
    let minutes = Math.floor(seconds / 60);
    let secs = seconds - 60 * minutes;
    if (minutes === 0) {
      minutes = minutes.toString() + "0";
    } else if (minutes < 10) {
      minutes = "0" + minutes.toString();
    }
    if (secs === 0) {
      secs = secs.toString() + "0";
    } else if (secs < 10) {
      secs = "0" + secs.toString();
    }
    return `${minutes}:${secs}`;
  };

  // compute flashcard percentage
  const percentage = (correct, total) => {
    let p = (correct / total) * 100;
    if (isNaN(p)) {
      return "N/A";
    } else {
      return String(p).slice(0, 5) + "%";
    }
  };

  useEffect(() => {
    if (props.gameMode === "individual") {
      setFadePage(
        <div className="text-5xl text-blue-400">
          Final Rank: {props.gameState["players"][props._id]["rank"]}
        </div>
      );
    } else if (props.gameMode === "team") {
      let winningTeam;
      if (props.gameState["redRank"] === 1) {
        winningTeam = "red";
      } else {
        winningTeam = "blue";
      }
      let winningTeamDiv;
      if (winningTeam === "red") {
        winningTeamDiv = (
          <div className="text-2xl">
            The <span className="text-red-600">Red</span> team outplayed the{" "}
            <span className="text-blue-600">Blue</span> team.
          </div>
        );
      } else {
        winningTeamDiv = (
          <div className="text-2xl">
            The <span className="text-blue-600">Blue</span> team outplayed the{" "}
            <span className="text-red-600">Red</span> team.
          </div>
        );
      }

      if (props.gameState["players"][props._id]["team"] === winningTeam) {
        setFadePage([<div className="text-4xl text-center">You won!</div>, winningTeamDiv]);
      } else {
        setFadePage([<div className="text-4xl text-center">You lost!</div>, winningTeamDiv]);
      }
    } else if (props.gameMode === "infection") {
      let winningTeam = "notInfected";
      if (props.gameState["infectedRank"] === 1) {
        winningTeam = "infected";
      }
      if (winningTeam === "infected") {
        setFadePage(
          <div className="text-4xl">
            The <span className="text-red-600">infected team</span> wins
          </div>
        );
      } else {
        let winning_player = "";
        for (let _id in props.gameState["players"]) {
          if (props.gameState["players"][_id] === props.gameState["numMazes"]) {
            winning_player = props.gameState["players"][_id]["name"];
          }
        }
        setFadePage([
          <div className="text-4xl">
            The <span className="text-green-600">non-infected team</span> wins
          </div>,
          <div>{winning_player} managed to finish the maze!</div>,
        ]);
      }
    }
  }, []);

  useEffect(() => {
    let dataDisplay = [];
    // rank
    if (props.gameMode === "individual") {
      dataDisplay.push(
        <div className="border-solid border-[1px] border-gray-400 text-4xl text-blue-200">
          Final Rank: {props.gameState["players"][props._id]["rank"]}
        </div>
      );
    }
    // level
    dataDisplay.push(
      <div className="border-solid border-[1px] border-gray-400">
        Reached Level: {props.gameState["players"][props._id]["level"]}
      </div>
    );

    // completion times
    // let level = props.gameState["players"][props._id]["level"];
    // for (let i = 1; i < level; i++) {
    //   let time;
    //   if (i === 1) {
    //     time = convertToTime(props.gameState["players"][props._id][`level${i}completion`]);
    //   } else if (i === 2 || i === 3) {
    //     time = convertToTime(
    //       props.gameState["players"][props._id][`level${i}completion`] -
    //         props.gameState["players"][props._id][`level${i - 1}completion`]
    //     );
    //   }
    //   let levelcompletionstring = `Time to complete level ${i}: ${time}`;
    //   dataDisplay.push(<div>{levelcompletionstring}</div>);
    // }
    // if (level == 4) {
    //   dataDisplay.push(
    //     <div>
    //       Time to complete game:{" "}
    //       {convertToTime(props.gameState["players"][props._id]["level3completion"])}
    //     </div>
    //   );
    // }

    // x coord
    // dataDisplay.push(
    //   <div>x: {Math.round(props.gameState["players"][props._id].p.x * 100) / 100}</div>
    // );

    // // y coord
    // dataDisplay.push(
    //   <div>y: {Math.round(props.gameState["players"][props._id].p.y * 100) / 100}</div>
    // );

    // questions data
    dataDisplay.push(
      <div className="border-solid border-[1px] border-gray-400">
        questions correct: {props.gameState["players"][props._id]["flashcards_correct"]}
      </div>
    );
    dataDisplay.push(
      <div className="border-solid border-[1px] border-gray-400">
        questions answered: {props.gameState["players"][props._id]["flashcards_total"]}
      </div>
    );
    dataDisplay.push(
      <div className="border-solid border-[1px] border-gray-400">
        % correct:{" "}
        {percentage(
          props.gameState["players"][props._id]["flashcards_correct"],
          props.gameState["players"][props._id]["flashcards_total"]
        )}
      </div>
    );

    // tagged data
    dataDisplay.push(
      <div className="border-solid border-[1px] border-gray-400">
        number of people tagged: {props.gameState["players"][props._id]["tags"]}
      </div>
    );
    dataDisplay.push(
      <div className="border-solid border-[1px] border-gray-400">
        {" "}
        number of times tagged: {props.gameState["players"][props._id]["numtagged"]}
      </div>
    );

    // other stats
    dataDisplay.push(
      <div className="border-solid border-[1px] border-gray-400">
        speed: {props.gameState["players"][props._id]["speed"]}
      </div>
    );
    dataDisplay.push(
      <div className="border-solid border-[1px] border-gray-400">
        power: {props.gameState["players"][props._id]["power"]}
      </div>
    );
    // dataDisplay.push(
    //   <div>active: {props.gameState["players"][props._id]["active"] ? "true" : "false"}</div>
    // );

    setDisplayData(<div>{dataDisplay}</div>);
  }, []);

  return (
    <>
      <div className="background">
        {showDisplayData && (
          <>
            <div className="sheerbox h-[80%] w-[40%] overflow-hidden opacity-100">
              <div className="text-center">
                <div className="text-5xl pb-2">Game Results</div>
              </div>
              <hr className="border-solid" />
              <div className="text-3xl">Game Metadata</div>
              <div className="text-xl">
                Game mode: <span className="text-blue-600">{props.gameMode}</span>
              </div>
              <div className="text-xl">
                You are:{" "}
                <span className="text-blue-600">
                  {props.gameState["players"][props._id]["name"]}
                </span>
              </div>
              {props.gameMode === "infection" && (
                <div className="text-xl">
                  Your final state:{" "}
                  {props.gameState["players"][props._id]["infected"] === true && (
                    <span className="text-red-600">infected</span>
                  )}
                  {props.gameState["players"][props._id]["infected"] === false && (
                    <span className="text-green-600">not infected</span>
                  )}
                </div>
              )}
              {props.gameMode === "team" && (
                <div className="text-xl">
                  Your team:{" "}
                  {props.gameState["players"][props._id]["team"] === "red" && (
                    <span className="text-red-600">Red</span>
                  )}
                  {props.gameState["players"][props._id]["team"] === "blue" && (
                    <span className="text-blue-600">Blue</span>
                  )}
                </div>
              )}
              <hr />
              <div className="text-3xl mb-5">Statistics</div>
              <div className="text-xl overflow-y-auto h-[40%] w-[70%]">{displayData}</div>
            </div>
            <div className="flex justify-center mt-3">
              <button
                className="editfbuttons font-Ubuntu w-[30vw] text-[1.5vw]"
                onClick={() => {
                  window.location.replace("/");
                }}
              >
                Return to Dashboard
              </button>
            </div>
          </>
        )}
        {!showDisplayData && (
          <div className="bg-black w-[100vw] h-[100vh] z-50 levelfadein">
            <div className="sheerbox h-[90%] w-[80%] overflow-hidden">
              <div className="fixed left-[50%] top-[40%] transform -translate-x-1/2">
                <div>{fadePage}</div>
              </div>
              <div className="fixed left-[50%] transform -translate-x-1/2">
                <button
                  className="editfbuttons font-Ubuntu w-[30vw] text-[2vw]"
                  onClick={() => {
                    setShowDisplayData(true);
                  }}
                >
                  See your stats
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StudentEndPage;
