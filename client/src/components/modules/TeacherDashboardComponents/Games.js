import React, { useState, useEffect } from "react";
import Game from "./Game";
import { get, post } from "../../../utilities";

const Games = (props) => {
  const [redirect, setRedirect] = useState(false);
  const [games, setGames] = useState([]);

  useEffect(() => {
    let cur_games = [];
    const getGames = async () => {
      for (const gameId of props.userData.games) {
        const game = await get("/api/gamebyid", { _id: gameId });
        console.log("a game", game);
        cur_games.push(game);
      }
    };
    getGames();
    console.log(cur_games);
  }, []);

  useEffect(() => {
    const getGames = async () => {
      for (const gameId of props.userData.games) {
        const game = await get("/api/gamebyid", { _id: gameId });
        setGames(games.concat([<Game datePlayed={game.datePlayed} gameState={game.gameState} />]));
      }
    };

    getGames();
  }, [props.userData]);

  return (
    <>
      {redirect ? (
        <Redirect from="/teacher" to={redirect} />
      ) : (
        <>
          <div className="background">
            <div class="sheerbox w-[60%]">
              <div className="flex mt-8">
                <div className="text-5xl text-blue-200 my-auto">Past Games</div>
              </div>
              <div className="overflow-y-auto overflow-x-hidden max-w-[95%] px-6 mx-auto mt-[2vw] mb-[6vw] rounded-xl h-[70vh]">
                {games.length ? (
                  games
                ) : (
                  <>
                    <div className="text-xl text-blue-300 text-center mt-[35vh]">
                      No past games to display
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Games;
