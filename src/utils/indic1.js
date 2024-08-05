let r = {
    name: 'TEST1',
    shortName: 'TEST1',
    calcParams: [120, 5],
    figures: [
      { key: 'em',title: 'emoji: ', },
    ],
    // 计算结果
    calc: (kLineDataList, { calcParams }) => {
      const closeSums = []
      const result = []
      // console.log(kLineDataList)
      kLineDataList.map((kLineData, i) => {
        const close = kLineData.close;
        const ma = {};
        closeSums[0] = (closeSums[0] || 0) + close
        if (i >= calcParams[0] - 1) {
            // ma[figures[0].key] = closeSums[0] / calcParams[0]
            closeSums[0] -= kLineDataList[i - (calcParams[0] - 1)].close ;
            const macolse= closeSums[0] / calcParams[0];
            
            const periodData = kLineDataList.slice(i - calcParams[0] + 1, i);
            const maxPrice = Math.max(...periodData.map(d => d.high));
            const maxIndex = periodData.map(d => d.high).lastIndexOf(maxPrice);
            const upprice = Math.min(calcParams[0] - maxIndex,calcParams[0]); // 最近的周期数值
            const up = (calcParams[0] - upprice)/calcParams[0]*100;
            // ma["up"] = up;
            // ma["up"] = macolse;
            const minPrice = Math.min(...periodData.map(d => d.low));
            const minIndex = periodData.map(d => d.low).lastIndexOf(minPrice);
            const downprice = Math.min(calcParams[0] - minIndex,calcParams[0]);// 最近的周期数值
            const down = (calcParams[0] - downprice)/calcParams[0]*100;
          //  ma["dn"] = down;
          //  ma["dn"] = macolse;

           const arongdif = up - down
           const dcon1 = (up >= 70 && arongdif > 0) ? true : false;
           const dcon2 = (down <= 30 && arongdif > 0) ? true : false;
           const kcon1 = (up >= 70 && arongdif < 0) ? true : false;
           const kcon2 = (down <= 30 && arongdif < 0) ? true : false;

           const pdcon1 = (arongdif >0 && up <=50)? true : false;
           const pkcon1 = (arongdif <0 && down <=50)? true : false;

           if (dcon1 || dcon2 && kLineData.close > macolse){
            //开多仓
            ma["em"] = { emoji: kLineData.close, 
              text: '🍏' }
           };
           if (kcon1 || kcon2 && kLineData.close < macolse){
            //开空仓
            ma["em"] = { emoji: kLineData.close, 
              text: '🍎' }
          };
          // if (pdcon1){
          //   ma["emoji"] = { emoji: kLineData.close, 
          //     text: "平多🍏" }
          // };
          // if (pkcon1){
          //   ma["emoji"] = { emoji: kLineData.close, 
          //     text: "平空🍎" }
          // };
        };
        result.push(ma);
      })
      console.log(result)
      return result
    },
    draw: ({
      ctx,
      barSpace,
      visibleRange,
      indicator,
      xAxis,
      yAxis
    }) => {
      const { from, to } = visibleRange
  
      ctx.font = barSpace.gapBar + 'px' + ' Helvetica Neue'
      ctx.textAlign = 'center'
      const result = indicator.result
      for (let i = from; i < to; i++) {
        try {
          const data = result[i].em
          const x = xAxis.convertToPixel(i)
          const y = yAxis.convertToPixel(data.emoji)
          ctx.fillText(data.text, x, y)
        } catch (error) {

          continue;
        }
      }
      return false
    }
  }

let c ={
  name: 'emoji',
  figures: [
    { key: 'emoji', title: 'emoji: '}
  ],
  calc: (kLineDataList) => {
    const fruits = [
      '🍏', '🍎', '🍐', '🍊', '🍋', '🍌',
      '🍉', '🍇', '🍓', '🍈', '🍒', '🍑',
      '🍍', '🥥', '🥝', '🥭', '🥑', '🍏'
    ]
    return kLineDataList.map(kLineData => ({ emoji: kLineData.close, 
      text: fruits[Math.floor(Math.random() * 17)] }))
  },
  draw: ({
    ctx,
    barSpace,
    visibleRange,
    indicator,
    xAxis,
    yAxis
  }) => {
    const { from, to } = visibleRange

    ctx.font = barSpace.gapBar + 'px' + ' Helvetica Neue'
    ctx.textAlign = 'center'
    const result = indicator.result
    for (let i = from; i < to; i++) {
      const data = result[i].em
      const x = xAxis.convertToPixel(i)
      const y = yAxis.convertToPixel(data.emoji)
      ctx.fillText(data.text, x, y)
    }
    return false
  }
}

xxscIndic(r)


xxscchart.createIndicator({
    name: "TEST1",
    // @ts-expect-error
    createTooltipDataSource: ({
      indicator: a,
      defaultStyles: i
    }) => {
      const o = [];
      return a.visible ? (o.push(i.tooltip.icons[1]), o.push(i.tooltip.icons[2]), o.push(i.tooltip.icons[3])) : (o.push(i.tooltip.icons[0]), o.push(i.tooltip.icons[2]), o.push(i.tooltip.icons[3])), {
        icons: o
      };
    }
  },false)


xxscchart.createIndicator({
  name: "TEST1",
  // @ts-expect-error
  createTooltipDataSource: ({
    indicator: a,
    defaultStyles: i
  }) => {
    const o = [];
    return a.visible ? (o.push(i.tooltip.icons[1]), o.push(i.tooltip.icons[2]), o.push(i.tooltip.icons[3])) : (o.push(i.tooltip.icons[0]), o.push(i.tooltip.icons[2]), o.push(i.tooltip.icons[3])), {
      icons: o
    };
  }
},false,  {
  "id": "candle_pane"
} )

xxscchart.overrideIndicator({
  name: "TEST1",
  calcParams:[30, 5],
}
)


//备份
let rr = {
  name: 'TEST1',
  shortName: 'TEST1',
  calcParams: [30, 5],
  figures: [
    { key: 'up', title: 'UP: ', type: 'line' },
    { key: 'dn', title: 'DN: ', type: 'line' },
  ],
  // 计算结果
  calc: (kLineDataList, { calcParams }) => {
    const closeSums = []
    const result = []
    // console.log(kLineDataList)
    kLineDataList.map((kLineData, i) => {
      const close = kLineData.close;
      const ma = {};
      closeSums[0] = (closeSums[0] || 0) + close
      if (i >= calcParams[0] - 1) {
          // ma[figures[0].key] = closeSums[0] / calcParams[0]
          closeSums[0] -= kLineDataList[i - (calcParams[0] - 1)].close ;
          const macolse= closeSums[0] / calcParams[0];
          
          const periodData = kLineDataList.slice(i - calcParams[0] + 1, i);
          const maxPrice = Math.max(...periodData.map(d => d.high));
          const maxIndex = periodData.map(d => d.high).lastIndexOf(maxPrice);
          const upprice = Math.min(calcParams[0] - maxIndex,calcParams[0]); // 最近的周期数值
          const up = (calcParams[0] - upprice)/calcParams[0]*100;
          ma["up"] = up;
          // ma["up"] = macolse;
          const minPrice = Math.min(...periodData.map(d => d.low));
          const minIndex = periodData.map(d => d.low).lastIndexOf(minPrice);
          const downprice = Math.min(calcParams[0] - minIndex,calcParams[0]);// 最近的周期数值
          const down = (calcParams[0] - downprice)/calcParams[0]*100;
         ma["dn"] = down;
        //  ma["dn"] = macolse;

         const arongdif = up - down
         const dcon1 = (up >= 70 && arongdif > 0) ? true : false;
         const dcon2 = (down <= 30 && arongdif > 0) ? true : false;
         const kcon1 = (up >= 70 && arongdif < 0) ? true : false;
         const kcon2 = (down <= 30 && arongdif < 0) ? true : false;

         const pdcon1 = (arongdif >0 && up <=50)? true : false;
         const pkcon1 = (arongdif <0 && down <=50)? true : false;

      };
      result.push(ma);
    })
    // console.log(result)
    return result
  }
}
