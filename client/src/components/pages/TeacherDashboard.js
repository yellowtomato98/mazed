import React, { useState, useEffect } from "react";
import { Link, Redirect } from "@reach/router";

import Navbar from "../modules/Navbar";
import LeftSideBar from "../modules/TeacherDashboardComponents/LeftSideBar";

import FlashcardSetsContainer from "../modules/TeacherDashboardComponents/FlashcardSetsContainer";
import Games from "../modules/TeacherDashboardComponents/Games";
import Settings from "../modules/TeacherDashboardComponents/Settings";
import Set from "../modules/TeacherDashboardComponents/Set";

import { get, post } from "../../utilities";
import { socket, checkAlreadyConnected } from "../../client-socket";

/**
 * Teacher Dashboard page
 * LeftSideBar is a component in TeacherDashboard that holds my sets, past games, settings
 *
 * Proptypes
 * @param {userId} userId user id
 * @param {userRole} userRole user role (teacher or student)
 * @param {userName} userName display name of user
 * @param {hl} hl handle logout
 */
const TeacherDashboard = (props) => {
  const [rightSide, setRightSide] = useState("sets"); //options are sets, pastGames, settings
  const [rightComponent, setRightComponent] = useState("");
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(undefined);
  const [redirectGame, setRedirectGame] = useState(undefined);
  const [userData, setUserData] = useState(undefined);
  const [setsMetadata, setSetsMetadata] = useState([]);
  const [foundGame, setFoundGame] = useState(false);

  useEffect(() => {
    if (rightSide === "sets")
      setRightComponent(
        <FlashcardSetsContainer
          metadata={setsMetadata}
          setSetsMetadata={setSetsMetadata}
          setUserData={setUserData}
          userId={props.userId}
        />
      );
    else if (rightSide == "pastGames") setRightComponent(<Games />);
    else setRightComponent(<Settings hl={props.hl} userData={userData} />);
  }, [rightSide, setsMetadata]);

  // get teacher data
  useEffect(() => {
    const renderDisplay = async () => {
      try {
        const data = await get("/api/userbyid");
        const metadata = await get("/api/setmetadata");
        setSetsMetadata(metadata.metadata);
        setUserData(data);
        if (data.role !== "teacher") {
          setRedirect(true);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setRedirect(true);
      }
    };
    renderDisplay();
  }, []);

  // check if teacher had a game running
  useEffect(() => {
    if (userData) {
      checkAlreadyConnected(userData._id);
    }
  }, [userData]);

  useEffect(() => {
    socket.on("checkAlreadyConnectedResult", (result) => {
      if (userData) {
        console.log(result);
        if (result._id === userData._id && result.result === true) {
          console.log("found a game you were already connected to");
          setFoundGame(true);
        }
      }
    });
  }, [userData]);

  const handleRejoin = () => {
    setRedirectGame(true);
  };

  return (
    <>
      {redirect ? (
        <Redirect noThrow from="/teacher" to="/login" />
      ) : redirectGame ? (
        <Redirect noThrow from="/teacher" to="/game" />
      ) : (
        <>
          {loading === true && <Navbar blank={true} />}
          {loading === false && (
            <Navbar userId={userData._id} userRole={userData.role} userName={userData.name} />
          )}
          {foundGame && (
            <div className="fixed top-[75px] h-[20px] text-center pt-[3px] w-full z-10 mx-auto bg-red-500">
              <div className="hover:cursor-pointer" onClick={handleRejoin}>
                You have a class playing! Click to rejoin
              </div>
            </div>
          )}
          <div className="bg-white bg-fixed bg-cover h-screen">
            <div class="h-[75px]"></div>
            <div className="flex">
              <div className="basis-1/5 w-40 overflow-y-hidden h-[calc(100vh_-_78px)]">
                <LeftSideBar setRightSide={setRightSide} />
              </div>
              <div className="flex-1 overflow-y-hidden h-[calc(100vh_-_78px)]">
                {loading === false && rightComponent}
                {loading === true && (
                  <div className="background text-[2vw] text-green-200">
                    Loading teacher dashboard...
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TeacherDashboard;
