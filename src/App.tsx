//import React = require('react');
import React,{ useRef, useState } from 'react';
import io from 'socket.io-client';
import { SOCKET_URL } from './config/default';
import './App.css';
import {EntryUserInfo } from "./types/EntryUserInfo";
import {BoardInfo } from "./types/BoardInfo";
import {Position } from "./types/Position";
import white from "./images/white.png";
import black from "./images/black.png";

const socket = io(SOCKET_URL);

//サーバーからのデータ受け取り処理
socket.on( "connect", function() {
	console.log("接続:"+socket.id);
}); //接続

socket.on( "disconnect", function() {
	console.log("切断");
}); //切断

function App(){
  const [entryUsers, setEntryUsers] = useState({
    users: [] as EntryUserInfo[]
  });
  const entryName = useRef<HTMLInputElement>(null);
  
  const [boardInfo, setBoardInfo] = useState<BoardInfo>({
    board: [] as string[][],
    invertedPositions: [] as Position[],
    nextTurn: '' as string,
    placesToPut: [] as Position[],
  });
  
  const [message, setMessage] = useState<string>("");
  
  const [turn, setTurn] = useState<string>("");
  
  const [splash, setSplash] = useState<boolean>(false);
  
  socket.on("entryInfo", (entryUsersStr: string) => {
    setEntryUsers(JSON.parse(entryUsersStr));
  });
  
  socket.on("moveInfo", (boardInfoStr: string) => {
    const info: BoardInfo = JSON.parse(boardInfoStr);
    setBoardInfo(info);
    setTurn(info.nextTurn);
  });
  
  socket.on("gameStart", (players: string) => {
    viewSplash("ゲーム開始！", 3000);
  });
  
  socket.on("gameOver", (winner: string) => {
    if (mode() === winner) {
      //勝利画面をスプラッシュ表示
      viewSplash("You Win!", 5000);
    }
    else if (mode() === (winner === 'W' ? 'B' : 'W')) {
      //敗北画面をスプラッシュ表示
      viewSplash("You Lose...", 5000);
    }
  });
  
  function viewSplash(message: string, showTime: number) {
    setMessage(message);
    setSplash(true);
    setTimeout(() => {
      setSplash(false);
    }, showTime);
  };
  function isEntry() {
    return (entryUsers.users.filter(entry => entry.socketId === socket.id).length > 0);
  }
  
  function mode() {
    const myEntry: EntryUserInfo[] | null = entryUsers.users.filter(entry => entry.socketId === socket.id);
    if (myEntry !== null && myEntry.length > 0) return myEntry[0].mode;
    return "";
  }
  
  function mark(mode: string) {
    if(mode === 'W') return '〇';
    else if(mode === 'B') return '●';
    else if(mode === 'E') return '＿';
    else return '';
  }
  
  function pieceColor(x:number, y:number) {
    return boardInfo.board.length > 0 ? boardInfo.board[y][x] : "";
  }
  
  function move(x:number, y:number) {
    const myMode: string = mode();
    if (myMode !== 'W' && myMode !== 'B') return;

    const data = {
      color: myMode,
      position: {
        x: x,
        y: y,
      }
    }
    console.log(data);
    socket.emit('move', JSON.stringify(data));
  }
  
  function handleEntry() {
    let entryUserInfo: EntryUserInfo = {
      name: entryName.current!.value,
      detail: "",
      mode: "",
      socketId: "",
    }
    socket.emit("entry", JSON.stringify(entryUserInfo));
  }
  
  function handleExit() {
    socket.emit("exit");
  }
  
  return (
    <div className="Wrapper">
      <div className="App">
        <div className="App-left">
          <table className="App-board">
            <tbody>
              <tr>
                <td onClick={() => move(0,0)}>{Piece(pieceColor(0,0))}</td>
                <td onClick={() => move(1,0)}>{Piece(pieceColor(1,0))}</td>
                <td onClick={() => move(2,0)}>{Piece(pieceColor(2,0))}</td>
                <td onClick={() => move(3,0)}>{Piece(pieceColor(3,0))}</td>
                <td onClick={() => move(4,0)}>{Piece(pieceColor(4,0))}</td>
                <td onClick={() => move(5,0)}>{Piece(pieceColor(5,0))}</td>
                <td onClick={() => move(6,0)}>{Piece(pieceColor(6,0))}</td>
                <td onClick={() => move(7,0)}>{Piece(pieceColor(7,0))}</td>
              </tr>
              <tr>
                <td onClick={() => move(0,1)}>{Piece(pieceColor(0,1))}</td>
                <td onClick={() => move(1,1)}>{Piece(pieceColor(1,1))}</td>
                <td onClick={() => move(2,1)}>{Piece(pieceColor(2,1))}</td>
                <td onClick={() => move(3,1)}>{Piece(pieceColor(3,1))}</td>
                <td onClick={() => move(4,1)}>{Piece(pieceColor(4,1))}</td>
                <td onClick={() => move(5,1)}>{Piece(pieceColor(5,1))}</td>
                <td onClick={() => move(6,1)}>{Piece(pieceColor(6,1))}</td>
                <td onClick={() => move(7,1)}>{Piece(pieceColor(7,1))}</td>
              </tr>
              <tr>
                <td onClick={() => move(0,2)}>{Piece(pieceColor(0,2))}</td>
                <td onClick={() => move(1,2)}>{Piece(pieceColor(1,2))}</td>
                <td onClick={() => move(2,2)}>{Piece(pieceColor(2,2))}</td>
                <td onClick={() => move(3,2)}>{Piece(pieceColor(3,2))}</td>
                <td onClick={() => move(4,2)}>{Piece(pieceColor(4,2))}</td>
                <td onClick={() => move(5,2)}>{Piece(pieceColor(5,2))}</td>
                <td onClick={() => move(6,2)}>{Piece(pieceColor(6,2))}</td>
                <td onClick={() => move(7,2)}>{Piece(pieceColor(7,2))}</td>
              </tr>
              <tr>
                <td onClick={() => move(0,3)}>{Piece(pieceColor(0,3))}</td>
                <td onClick={() => move(1,3)}>{Piece(pieceColor(1,3))}</td>
                <td onClick={() => move(2,3)}>{Piece(pieceColor(2,3))}</td>
                <td onClick={() => move(3,3)}>{Piece(pieceColor(3,3))}</td>
                <td onClick={() => move(4,3)}>{Piece(pieceColor(4,3))}</td>
                <td onClick={() => move(5,3)}>{Piece(pieceColor(5,3))}</td>
                <td onClick={() => move(6,3)}>{Piece(pieceColor(6,3))}</td>
                <td onClick={() => move(7,3)}>{Piece(pieceColor(7,3))}</td>
              </tr>
              <tr>
                <td onClick={() => move(0,4)}>{Piece(pieceColor(0,4))}</td>
                <td onClick={() => move(1,4)}>{Piece(pieceColor(1,4))}</td>
                <td onClick={() => move(2,4)}>{Piece(pieceColor(2,4))}</td>
                <td onClick={() => move(3,4)}>{Piece(pieceColor(3,4))}</td>
                <td onClick={() => move(4,4)}>{Piece(pieceColor(4,4))}</td>
                <td onClick={() => move(5,4)}>{Piece(pieceColor(5,4))}</td>
                <td onClick={() => move(6,4)}>{Piece(pieceColor(6,4))}</td>
                <td onClick={() => move(7,4)}>{Piece(pieceColor(7,4))}</td>
              </tr>
              <tr>
                <td onClick={() => move(0,5)}>{Piece(pieceColor(0,5))}</td>
                <td onClick={() => move(1,5)}>{Piece(pieceColor(1,5))}</td>
                <td onClick={() => move(2,5)}>{Piece(pieceColor(2,5))}</td>
                <td onClick={() => move(3,5)}>{Piece(pieceColor(3,5))}</td>
                <td onClick={() => move(4,5)}>{Piece(pieceColor(4,5))}</td>
                <td onClick={() => move(5,5)}>{Piece(pieceColor(5,5))}</td>
                <td onClick={() => move(6,5)}>{Piece(pieceColor(6,5))}</td>
                <td onClick={() => move(7,5)}>{Piece(pieceColor(7,5))}</td>
              </tr>
              <tr>
                <td onClick={() => move(0,6)}>{Piece(pieceColor(0,6))}</td>
                <td onClick={() => move(1,6)}>{Piece(pieceColor(1,6))}</td>
                <td onClick={() => move(2,6)}>{Piece(pieceColor(2,6))}</td>
                <td onClick={() => move(3,6)}>{Piece(pieceColor(3,6))}</td>
                <td onClick={() => move(4,6)}>{Piece(pieceColor(4,6))}</td>
                <td onClick={() => move(5,6)}>{Piece(pieceColor(5,6))}</td>
                <td onClick={() => move(6,6)}>{Piece(pieceColor(6,6))}</td>
                <td onClick={() => move(7,6)}>{Piece(pieceColor(7,6))}</td>
              </tr>
              <tr>
                <td onClick={() => move(0,7)}>{Piece(pieceColor(0,7))}</td>
                <td onClick={() => move(1,7)}>{Piece(pieceColor(1,7))}</td>
                <td onClick={() => move(2,7)}>{Piece(pieceColor(2,7))}</td>
                <td onClick={() => move(3,7)}>{Piece(pieceColor(3,7))}</td>
                <td onClick={() => move(4,7)}>{Piece(pieceColor(4,7))}</td>
                <td onClick={() => move(5,7)}>{Piece(pieceColor(5,7))}</td>
                <td onClick={() => move(6,7)}>{Piece(pieceColor(6,7))}</td>
                <td onClick={() => move(7,7)}>{Piece(pieceColor(7,7))}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="App-right">
          <p>
            <label htmlFor="entryName">ハンドル・ネーム</label>
            <input disabled={isEntry()} type="text" id="entryName" maxLength={8} ref={entryName} />
            <button className="entry" disabled={isEntry()} onClick={handleEntry}>ENTRY</button>
            <button className="entry" disabled={!isEntry()} onClick={handleExit}>EXIT</button>
          </p>
          <div>
          {entryUsers.users.length > 0 && (
            <table className='App-entry-list'>
              <tbody>
              {entryUsers.users.map((entry: EntryUserInfo, index: number) => {
                return (
                  <tr key={index}>
                    <td>{mark(entry.mode)}</td><td>{entry.name}</td>
                  </tr>
                )
              })}
              </tbody>
            </table>
          )}
          </div>
        </div>
        <div className="App-footer">
          <div><span>{GameMessage(mode())}</span></div>
          <div><span>{GetTurn(turn)}</span></div>
          <div className="game-control"><button className='App-ctrl-btn' onClick={pass}>パス</button>&nbsp;<button className='App-ctrl-btn' onClick={surrender}>まいった！</button></div>
        </div>
        <div className="splash" style={{ visibility: splash ? "visible" : "hidden" }}>
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
}

function pass() {
  socket.emit("pass", "");
}

function surrender() {
  socket.emit("surrender", "");
}

function Piece(color: string) {
  return (<>
    {color === "W" && (
      <img src={white} width="50px" alt="white"/>
    )}
    {color === "B" && (
      <img src={black} width="50px" alt="black"/>
    )}
    </>
  );
}

function GetTurn(color: string) {
  return (<>
    {color === "B" && (
      <span><img src={black} width="30px" alt="black"/><span>のターンです</span></span>
    )}
    {color === "W" && (
      <span><img src={white} width="30px" alt="white"/><span>のターンです</span></span>
    )}
    </>
  );
}

function GameMessage(color: string) {
  return (<>
    {color === "B" && (
      <span><span>あなたは</span><img src={black} width="30px" alt="black"/><span>のプレイヤーです</span></span>
    )}
    {color === "W" && (
      <span><span>あなたは</span><img src={white} width="30px" alt="white"/><span>のプレイヤーです</span></span>
    )}
    {color === "E" && (
      <span><span>あなたは</span><span>観戦者</span><span>です</span></span>
    )}
    {color !== "W" && color !== "B" && color !== "E" && (
      <span><span>入室してください</span></span>
    )}
    </>
  );
}  

export default App;
