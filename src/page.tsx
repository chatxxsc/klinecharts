import React, { useState,useEffect } from 'react';
import './index.css';
import { Layout, Menu, theme ,Divider ,Button,Flex, Input,Table , Tag,Space } from 'antd';
import type { TableProps } from 'antd';

import setupApp from './app';
import '@klinecharts/pro/dist/klinecharts-pro.css';
import './index.css'


const { Header, Content, Footer } = Layout;


const items = [{
  key: '1',
  label: "首页",
},{
  key: '2',
  label: "实时订单",
},{
  key: '3',
  label: "操作记录",
}]

interface DataType {
  key: React.Key;
  orderid: number;
  symbol: string;
  open: string;
  sellprice:string;
  money:string;
  time:string;
  tags: string[];
  nicname: string;
}
const columns: TableProps<DataType>['columns'] = [
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
    title: '操作',
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
const data: DataType[] = [
  {
    key: 1,
    orderid: 1,
    symbol: 'BTCUSDT',
    open: "64,561.5",
    sellprice: '68,064.3',
    money: "-12.49%",
    time:"07-18 10:10",
    tags:["okx","空","100x"],
    nicname:"金闪闪弗利萨"
  },
  {
    key: 2,
    orderid: 2,
    symbol: 'ETHUSDT',
    open: "64,561.5",
    sellprice: '68,064.3',
    money: "12.49%",
    time:"07-18 10:10",
    tags:["okx","多","100x"],
    nicname:"金闪闪弗利萨"
  }
];

interface HistoryData {
  key: React.Key;
  orderid: number;
  instId: string;
  posSide:string;
  sellprice: string;
  cTime:string;
  tags: string[];
  nickName: string;
}

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
const Historydata: HistoryData[] = [
  {
    key: 1,
    orderid: 1,
    instId: 'ETH-USDT-SWAP',
    posSide: '多',
    sellprice: "3492.59",
    cTime:"07-18 10:10",
    tags:["okx","limit","买入开多"],
    nickName:"金闪闪弗利萨"
  }]
// const rowSelection = {
//   onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
//     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
//   },
//   getCheckboxProps: (record: DataType) => ({
//     // disabled: record.orderid === 'Disabled User', // Column configuration not to be checked
//     name: record.orderid,
//   }),
// };

//main
const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [selectedKey, setSelectedKey] = useState('1');
  const [initialized, setInitialized] = useState(false);

  const [loadings, setLoadings] = useState<boolean[]>([]);
  const handleMenuClick = (e: any) => {
    setSelectedKey(e.key);
  };

  const enterLoading = (index: number) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });

    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 1000);
  }
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [loading2, setLoading2] = useState(false);
  
    const start = () => {
      setLoading2(true);
      // ajax request after empty completing
      setTimeout(() => {
        setSelectedRowKeys([]);
        setLoading2(false);
      }, 1000);
    };


    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
      console.log('selectedRowKeys changed: ', newSelectedRowKeys);
      setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

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
                <Divider orientation="left">初始化</Divider>
                <Flex wrap gap="small">
                      <Button type="primary">注册图形</Button>
                      <Button type="primary">注册覆盖物</Button>
                </Flex>
                <Divider orientation="left">图表操作</Divider>
                <Flex wrap gap="small">
                     <Button type="primary">创建</Button>
                      <Button type="primary">更新</Button>
                      <Button type="primary">删除</Button>
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
                <Input placeholder="http://okx浪浪" allowClear size="large" style= {{width :"600px"}}/>
              <Button type="primary" size="large" 
              loading={loadings[1]}
              onClick={() => enterLoading(1)} >添加至表格</Button>
              <Button type="primary" size="large">查询操作记录</Button>
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
                  <Button type="primary">清空图表</Button>
                  </Flex>
                    <span style={{ marginLeft: 8 }}>
                    {hasSelected ? `选中 ${selectedRowKeys.length} 个` : ''}
                  </span>
                </div>
                <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
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
                <Input placeholder="http://okx浪浪" allowClear size="large" style= {{width :"600px"}}/>
              <Button type="primary" size="large">查询操作记录</Button>
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
                <Table columns={Historycolumns} dataSource={Historydata} />
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
