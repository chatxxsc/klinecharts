import React, { useState, useEffect ,useRef} from 'react';
import './index.css';
import { Layout, Menu, theme ,Divider ,Button,Flex, Input ,Table , Tag,Space } from 'antd';
import type { TableProps ,InputRef} from 'antd';
// import { InputRef } from 'antd/lib/input';

import setupApp from './app';
import '@klinecharts/pro/dist/klinecharts-pro.css';
import './index.css'

import { watchSymbol } from "./api";

const { Header, Content, Footer } = Layout;
const { TextArea } = Input;

const items = [{
  key: '1',
  label: "首页",
},{
  key: '2',
  label: "实时订单",
},{
  key: '3',
  label: "操作记录",
},{
  key: '4',
  label: "手动导入",
}]

interface syncklinedata {
  timestamp:number;
  value:number;
}
interface syncklinetext {
  color:string;
  side:string;
}

interface syncklinetag {
  id:string;
  dataxy:syncklinedata[];
  dataclor:syncklinetext[];  
}

interface listtagdata {
  [key: string]: syncklinetag;
}

interface initDataType {
  key: React.Key;
  orderid: number;
  symbol: string;
  open: string;
  sellprice:string;
  money:string;
  time:string;
  tags: string[];
  nicname: string;
  hidden:string;
}

const columns: TableProps<initDataType>['columns'] = [
  {
    title: '序号',
    dataIndex: 'orderid',
    key: 'orderid',
    // render: (text) => <a>{text}</a>,
  },
  {
    title: 'Symbol',
    dataIndex: 'symbol',
    key: 'symbol',
    showSorterTooltip: { target: 'full-header' },
    filters: [
      {
        text: 'BTCUSDT',
        value: 'BTCUSDT',
      },
      {
        text: 'ETHUSDT',
        value: 'ETHUSDT',
      },
    ],
    onFilter: (value, record) => record.symbol.indexOf(value as string) === 0,
    filterSearch: true,
  },  {
    title: '开仓',
    dataIndex: 'open',
    key: 'open',
  },
  {
    title: '强平价',
    dataIndex: 'sellprice',
    key: 'sellprice',
  },
  {
    title: '收益',
    dataIndex: 'money',
    key: 'money',
    render: (text: string) => (
      <span style={{ color: parseFloat(text) > 0 ? 'green' : parseFloat(text) < 0 ? 'red' : 'red' }}>
        {text}
      </span>
    ),
  },
  {
    title: '开仓时间',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '标签',
    dataIndex: 'tags',
    key: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag === "空" ? 'red' : 'green';
          if (tag === 'okx') {
            color = 'yellow';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    )
  },
  {
    title: '网名',
    dataIndex: 'nicname',
    key: 'nicname',
  },
  {
    title: '操作(待定)',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>跟单</a>
        <a>撤销</a>
        <a>平仓</a>
      </Space>
    ),
  },
];

// nav2 数据表的值
let data: initDataType[] = [];
const nicnameid = "2BE980C9BEA40361"

interface HistoryData {
  key: React.Key;
  orderid: number;
  instId: string;
  posSide:string;
  sellprice: string;
  cTime:string;
  tags: string[];
  nickName: string;
  hidden:string;
}
let Historydata: HistoryData[] = [];


const Historycolumns: TableProps<HistoryData>['columns'] = [
  {
    title: '序号',
    dataIndex: 'orderid',
    key: 'orderid',
    // render: (text) => <a>{text}</a>,
  },
  {
    title: 'Symbol',
    dataIndex: 'instId',
    key: 'instId',
  },
  {
    title: '多单|空单',
    dataIndex: 'posSide',
    key: 'posSide',
    render: (text: string) => (
      <span style={{ color: text.includes('多') ? 'green' : text.includes('空') ? 'red' : 'red' }}>
        {text}
      </span>
    ),
  },
  {
    title: '价格',
    dataIndex: 'sellprice',
    key: 'sellprice',
  },
  {
    title: '时间',
    dataIndex: 'cTime',
    key: 'cTime',
  },
  {
    title: '标签',
    dataIndex: 'tags',
    key: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag === "空" ? 'red' : 'green';
          if (tag === 'okx') {
            color = 'yellow';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    )
  },  
  {
    title: '网名',
    dataIndex: 'nickName',
    key: 'nickName',
  }
]

//main
const App: React.FC = () => {
  const removebutton = () => {
    (window as any).xxscchart.removeOverlay({
      name: 'texttag',
      id: 'texttag_1',
      groupId: 'texttag',
    })  
    console.log("remn成功")
  };

  let tagdiskdata:listtagdata ={}
  const tagdiskname: string[] = [];
  const dataint = ()=>{
    watchSymbol.gettags().then((response: any) => {
      settagdata(response);
      const keys = Object.keys(response);
      setTagsData(keys)
      console.log("updatedone")
    });
  }

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [tagdata, settagdata] = useState<listtagdata>(tagdiskdata);

  const [selectedKey, setSelectedKey] = useState('1');
  const [initialized, setInitialized] = useState(false);

  const [loadings, setLoadings] = useState<boolean[]>([]);
  const [syncnav1data,setsyncnav1data] = useState<initDataType[]>([]);

  const handleMenuClick = (e: any) => {
    setSelectedKey(e.key);
  };
  const nav1input = useRef<InputRef>(null);

  const clickdata = (nic:string) =>{
    watchSymbol.positions(nic).then((response: any) => {data = response[0].posData.map((item: any,index:number) => {
      const date: Date = new Date(parseInt(item.cTime, 10));
      const padZero = (num: number): string => num.toString().padStart(2, '0');
      const [month, day, hours, minutes, seconds]: string[] = [
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      ].map(padZero);
      return {
        key: index,
        orderid: index,
        symbol: item.instId,
        open: item.avgPx,
        sellprice: item.liqPx,
        money: `${(parseFloat(item.uplRatio) * 100).toFixed(2)}%`,
        time:`${month}月${day}日 ${hours}:${minutes}:${seconds}`,
        tags:["okx",item.posSide,item.lever],
        nicname:nicnameid,
        hidden:item.cTime,
      }; 
      });
      setsyncnav1data((prevdata) => {
        // const newLoadings = [...prevLoadings];
        // newLoadings[index] = data;
        prevdata = data
        return prevdata;
      });
    });
  }

  const enterLoading = (index: number) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });

    const valuenav1input = nav1input.current?.input?.value || '';
    const match = valuenav1input.match(/\/account\/([^?]*)/);
    const accountId = match ? match[1] : "";
    
    // console.log(accountId); // 输出：2BE980C9BEA40361
    if (accountId) {
        clickdata(accountId);
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = false;
          return newLoadings;
        });
    }
  }
    // const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRowdata, setselectedRowdata] = useState<initDataType[]>([]);
    const [loading2, setLoading2] = useState(false);
  
    const [tagsData, setTagsData] = useState<string[]>(tagdiskname);

    const [selectedTags, setSelectedTags] = useState<string[]>(['']);
    const handleChange = (tag: string, checked: boolean) => {
      const nextSelectedTags = checked
        ? [...selectedTags, tag]
        : selectedTags.filter((t) => t !== tag);
        if (checked) {
          (window as any).xxscchart.createOverlay({
              name: "texttag",
              id: tagdata[tag].id,
              groupId: "texttag",
              extendData : tagdata[tag].dataclor,
              points:tagdata[tag].dataxy,
              lock: false,
              visible: true,
              zLevel: 0,
            })
        } else {
          // console.log('关闭');
          (window as any).xxscchart.removeOverlay({
            name: "texttag",
            id: tagdata[tag].id,
            groupId: "texttag",
          })  
        }
      setSelectedTags(nextSelectedTags);
    };
  
    // 添加新Tag
    const addTag = (Tagto:string) => {
      if (tagsData)
      setTagsData(prevTags => [...prevTags, Tagto]);
    };
  

    const start = () => {
      const taglength = tagsData.length;
      const tagsecname = selectedRowdata[0].symbol;
      const filltagdata : syncklinetag=  {
        id:""+taglength+tagsecname,
        dataxy:selectedRowdata.map((item:initDataType) => ({
          timestamp:parseInt(item.hidden),value:parseFloat(item.open)
        })),
        dataclor:selectedRowdata.map((item:initDataType) => {

          if (item.tags[1].includes("short")){
            return {color:"#f75252",side:`买入开空@${item.open}`}
          }
          else{
            return {color:"#00d0aa",side:`买入开多@${item.open}`}
          }
          }
        )
      }
      const taganme:string = ""+taglength+"|"+filltagdata.dataxy.length+tagsecname
      settagdata(prevListtagdata => ({
          ...prevListtagdata,
          [taganme]: filltagdata
        }));
      addTag(taganme);
      console.log(tagdata);
      };


    const hasSelected = selectedRowdata.length > 0;

    const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: initDataType[]) => {
      // console.log('selectedRowKeys changed: ', selectedRows);
      setselectedRowdata(selectedRows);
    };

    const rowSelection = {
      selectedRowdata,
      onChange: onSelectChange,
    };

    
    const [HistoryselectedRowKeys, setHistorySelectedRowKeys] = useState<HistoryData[]>([]);
    const [Historyloading, HistorysetLoading] = useState(false);
    const [syncnav3data,setsyncnav3data] = useState<HistoryData[]>([]);

    const nav3input = useRef<InputRef>(null);
    const clickHistorydata = (nic:string) =>{ watchSymbol.tradeRecords(nic).then((response:any)=>{Historydata = response.map((item: any,index:number) => {
      let orderside;
      if (item.side === "buy" && item.posSide === "long") {
          orderside = "买入开多";
      } else if (item.side === "sell" && item.posSide === "long") {
          orderside = "卖出平多";
      } else if (item.side === "sell" && item.posSide === "short") {
          orderside = "卖出开空";
      } else if (item.side === "buy" && item.posSide === "short") {
          orderside = "买入平空";
      }
      
      const date: Date = new Date(parseInt(item.cTime, 10));
      const padZero = (num: number): string => num.toString().padStart(2, '0');
      const [month, day, hours, minutes, seconds]: string[] = [
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      ].map(padZero);
      return {
        key: index,
        orderid: index,
        instId: item.instId,
        posSide: orderside,
        sellprice: item.avgPx,
        cTime:`${month}月${day}日 ${hours}:${minutes}:${seconds}`,
        tags: ["okx",item.ordType],
        nickName: nicnameid,
        hidden:item.cTime,
      }; 
      });

      setsyncnav3data((prevdata) => {
        // const newLoadings = [...prevLoadings];
        // newLoadings[index] = data;
        prevdata = Historydata
        return prevdata;
      });
      }
    );
    
    }

    const addhistorydata = () => {
      const valuenav3input = nav3input.current?.input?.value || '';
      const match = valuenav3input.match(/\/account\/([^?]*)/);
      const accountId = match ? match[1] : "";
      if (accountId) {
        clickHistorydata(accountId);
      }
    }
    const Historystart = () => {
      const taglength = tagsData.length;
      const tagsecname = HistoryselectedRowKeys[0].instId;
      const filltagdata : syncklinetag=  {
        id:""+taglength+tagsecname,
        dataxy:HistoryselectedRowKeys.map((item:HistoryData) => ({
          timestamp:parseInt(item.hidden),value:parseFloat(item.sellprice)
        })),
        dataclor:HistoryselectedRowKeys.map((item:HistoryData) => {
          if (item.posSide.includes("空")){
            return {color:"#f75252",side:`${item.posSide}@${item.sellprice}`}
          }
          else{
            return {color:"#00d0aa",side:`${item.posSide}@${item.sellprice}`}
          }
          }
        )
      }
      
      const taganme:string = ""+taglength+"|"+filltagdata.dataxy.length+tagsecname
      settagdata(prevListtagdata => ({
        ...prevListtagdata,
        [taganme]: filltagdata
      }));
      addTag(taganme);
      console.log(tagdata);
      };
      
    const HistoryhasSelected = HistoryselectedRowKeys.length > 0;

    const HistoryonSelectChange = (newSelectedRowKeys: React.Key[],selectedRows: HistoryData[]) => {
      // console.log('selectedRows changed: ', selectedRows);
      setHistorySelectedRowKeys(selectedRows);
    };

    const HistoryrowSelection = {
      HistoryselectedRowKeys,
      onChange: HistoryonSelectChange,
    };

    const nav4input = useRef<InputRef>(null);
    
    const jsonfamate =  () => {
      const valuenav4input = nav4input.current.resizableTextArea.textArea.value;
      const keys: string[] = ["symbol", "typeStr", "fieldPrice", "side", "fieldAmount", "type", "orderDate"];
      interface CsvRecord {
        symbol: string;
        typeStr: string;
        fieldPrice: string;
        side: string;
        fieldAmount: string;
        type: string;
        orderDate: string;
      }

      if (valuenav4input){
        const lines: string[] = valuenav4input.split('\n').filter((line: string) => line.trim() !== '');
        const result = lines.map(line => {
          const fields = line.split('\t');
          const obj: Partial<CsvRecord> = {};
          keys.forEach((key, index) => {
            obj[key as keyof CsvRecord] = fields[index];
          });
          return obj as CsvRecord;
        });

        const taglength = tagsData.length;
        const tagsecname = result[0].symbol;
        const filltagdata : syncklinetag=  {
          id:""+taglength+tagsecname,
          dataxy:result.map((item:CsvRecord) => ({
            timestamp:new Date(item.orderDate).getTime(),value:parseFloat(item.fieldPrice)
          })),
          dataclor:result.map((item:CsvRecord) => {
            if (item.typeStr.includes("空")){
              return {color:"#f75252",side:`${item.typeStr}@${item.fieldPrice}`}
            }
            else{
              return {color:"#00d0aa",side:`${item.typeStr}@${item.fieldPrice}`}
            }
            }
          )
        }
        
        const taganme:string = ""+taglength+"|"+filltagdata.dataxy.length+tagsecname
        settagdata(prevListtagdata => ({
          ...prevListtagdata,
          [taganme]: filltagdata
        }));
        addTag(taganme);
        console.log(tagdata);

      }

    }

  useEffect(() => {
    if (!initialized) {
      setupApp(document.querySelector<HTMLDivElement>('#app')!);
      setInitialized(true);
    }
  }, [initialized]);

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={items}
          onClick={handleMenuClick}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: '20px 48px' }}>

      <div id="nav1" style={{ display: selectedKey === '1' ? 'block' : 'none' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div
                id = "app"
                style={{
                  background: colorBgContainer,
                  width: "80%",
                  minWidth: 1000,
                  borderRadius: borderRadiusLG,
                }}
              >
              </div>
              <div
                style={{
                  background: colorBgContainer,
                  width: "20%",
                  minWidth: 240,
                  height:800,
                  padding: 24,
                  borderRadius: borderRadiusLG,
                }}
              >
                <Divider orientation="left">图表操作</Divider>
                <Flex wrap gap="small">
                     <Button type="primary">创建</Button>
                      <Button type="primary" onClick={dataint}>更新</Button>
                      <Button type="primary" onClick={removebutton} >删除</Button>
                </Flex>
                <Divider orientation="left">显示：{tagsData.length}个</Divider>
                {/* <button onClick={() => addTag('NewTag')}>添加Tag</button> */}
                <Flex gap={10} wrap align="center">
                {tagsData.map<React.ReactNode>((tag) => (
                  <Tag.CheckableTag
                    key={tag}
                    checked={selectedTags.includes(tag)}
                    onChange={(checked) => handleChange(tag, checked)}
                  >
                    {tag}
                  </Tag.CheckableTag>
                ))}
              </Flex>
              </div>
            </div>
          </div>

          <div id="nav2" style={{ display: selectedKey === '2' ? 'block' : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  background: colorBgContainer,
                  minHeight: 20,
                  padding: 24,
                  borderRadius: borderRadiusLG,
                }}
              >
                <Flex wrap gap="small">
                <Input placeholder="http://okx浪浪" allowClear size="large" ref={nav1input} style= {{width :"600px"}}/>
              <Button type="primary" size="large" 
              loading={loadings[1]}
              onClick={() => enterLoading(1)} >查询仓位订单</Button>
              </Flex>
              </div>
              <div
                style={{
                  background: colorBgContainer,
                  minHeight: 280,
                  padding: 24,
                  borderRadius: borderRadiusLG,
                }}
              >
              <>
                <div style={{ marginBottom: 16 }}>
                <Flex wrap gap="small">
                  <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading2}>
                    更新至图表
                  </Button>
                  <Flex gap={10} wrap align="center">
                  {tagsData.map<React.ReactNode>((tag) => (
                    <Tag.CheckableTag
                      key={tag}
                      checked={selectedTags.includes(tag)}
                      onChange={(checked) => handleChange(tag, checked)}
                    >
                      {tag}
                    </Tag.CheckableTag>
                  ))}
                </Flex>
                </Flex>
                  <span style={{ marginLeft: 8 }}>
                    {hasSelected ? `选中 ${selectedRowdata.length} 个` : ''}
                  </span>
                </div>
                <Table rowSelection ={rowSelection} columns={columns} dataSource={syncnav1data} />
              </>
              </div>
            </div>
          </div>

          <div id="nav3" style={{ display: selectedKey === '3' ? 'block' : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  background: colorBgContainer,
                  minHeight: 20,
                  padding: 24,
                  borderRadius: borderRadiusLG,
                }}
              >
                <Flex wrap gap="small">
                <Input placeholder="http://okx浪浪操作记录" allowClear ref={nav3input} size="large" style= {{width :"600px"}}/>
              <Button type="primary" size="large" onClick={addhistorydata} >查询操作记录</Button>
              </Flex>
              </div>
              <div
                style={{
                  background: colorBgContainer,
                  minHeight: 280,
                  padding: 24,
                  borderRadius: borderRadiusLG,
                }}
              >
                <div style={{ marginBottom: 16 }}>
                <Flex wrap gap="small">
                  <Button type="primary" onClick={Historystart} disabled={!HistoryhasSelected} loading={Historyloading}>
                    更新至图表
                  </Button>
                  <Flex gap={10} wrap align="center">
                {tagsData.map<React.ReactNode>((tag) => (
                  <Tag.CheckableTag
                    key={tag}
                    checked={selectedTags.includes(tag)}
                    onChange={(checked) => handleChange(tag, checked)}
                  >
                    {tag}
                  </Tag.CheckableTag>
                ))}
              </Flex>
                </Flex>
                  <span style={{ marginLeft: 8 }}>
                    {HistoryhasSelected ? `选中 ${HistoryselectedRowKeys.length} 个` : ''}
                  </span>
                </div>
                <Table rowSelection={HistoryrowSelection} columns={Historycolumns} dataSource={syncnav3data} />
              </div>
            </div>
          </div>
          <div id="nav4" style={{ display: selectedKey === '4' ? 'block' : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  background: colorBgContainer,
                  minHeight: 20,
                  padding: 24,
                  borderRadius: borderRadiusLG,
                }}
              >
                <Flex wrap gap="small">
                <TextArea showCount placeholder="下单明细"  ref={nav4input} style={{ width: '700px' ,height: '260px' }}/>
              <Button type="primary" size="large" onClick={jsonfamate} >导入</Button>
              </Flex>
              </div>
              <div
                style={{
                  background: colorBgContainer,
                  minHeight: 280,
                  padding: 24,
                  borderRadius: borderRadiusLG,
                }}
              >
                <div style={{ marginBottom: 16 }}>
                <Flex wrap gap="small">
                  <Button type="primary" onClick={Historystart} disabled={!HistoryhasSelected} loading={Historyloading}>
                    更新至图表
                  </Button>
                  <Flex gap={10} wrap align="center">
                {tagsData.map<React.ReactNode>((tag) => (
                  <Tag.CheckableTag
                    key={tag}
                    checked={selectedTags.includes(tag)}
                    onChange={(checked) => handleChange(tag, checked)}
                  >
                    {tag}
                  </Tag.CheckableTag>
                ))}
              </Flex>
                </Flex>
                  <span style={{ marginLeft: 8 }}>
                    {HistoryhasSelected ? `选中 ${HistoryselectedRowKeys.length} 个` : ''}
                  </span>
                </div>
                <Table rowSelection={HistoryrowSelection} columns={Historycolumns} dataSource={syncnav3data} />
              </div>
            </div>
          </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        底部区域©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default App;
