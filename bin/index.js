#!/usr/bin/env node
'use strict';

const { exec } = require('child_process')

let totalSecond = 0
let wrapSecondList = []

/**
 * タイマーを開始
 */
function startTimer() {
  let timerId = setInterval(() => {
    totalSecond--

     notifyWrapTime(totalSecond)

    if (totalSecond <= 0) {
      console.clear()
      clearInterval(timerId)
    }

    showRemainTime(totalSecond)
  }, 1000)
}

/**
 * 経過時間を通知
 * @param {Number} remainTime 残り時間(秒)
 */
function notifyWrapTime(remainTime) {
  const wrapIndex = wrapSecondList.findIndex(item => item.sec === remainTime)
  if (wrapIndex >= 0) {
    exec(`say ${wrapSecondList[wrapIndex].text}`)
  }
}

/**
 * 残り時間を表示
 * @param {Number} remainTime 残り時間(秒)
 */
function showRemainTime(remainTime) {
  process.stdout.write(`\r${convertToTime(remainTime)}`)
}

/**
 * 0埋めして、2桁表示
 * @param {Number} value
 * @returns {String}
 */
function twoDigit(value) {
  return value.toString().padStart(2, '0')
}

/**
 * 秒を分秒表示に変更
 * @param {Number} value
 * @returns {String} 分:秒
 */
function convertToTime(value) {
  const minutes = twoDigit(parseInt(value / 60))
  const seconds = twoDigit(value % 60)
  return `${minutes}:${seconds}`
}

/**
 * メイン処理
 */
function main() {
  if (process.argv.length < 3) {
    console.log('No Arguments.')
    process.exit(0)
  }

  // コマンドライン引数から設定値の情報を取得する
  let [, , ...params] = process.argv

  const wrapList = params.map(value => parseInt(value))

  totalSecond = wrapList.reduce((prev, current) => {
    return prev + current * 60
  }, 0)

  let count = 0
  wrapList.forEach(minutes => {
    count += minutes
    const sec = totalSecond - count * 60
    wrapSecondList.push({
      sec,
      text: (sec > 0) ? `${minutes}分経過しました` : '終了です'
    })
  })

  const totalMinutes = wrapList.reduce((prev, current) => prev + current, 0)
  exec(`say ${totalMinutes}分のタイマーを開始します`)

  console.log('中止する場合、Command + C')

  startTimer()
}


main()