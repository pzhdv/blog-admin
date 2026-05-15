import { fetchQueryArticleCategoryPieChart } from '@/service/api';

interface IData {
  name: string;
  value: number;
}
const PieChart = () => {
  const [chartData, setChartData] = useState<IData[]>([]);

  const pieChartColors = [
    '#5da8ff',
    '#ff8a69',
    '#8e9dff',
    '#69e0ff',
    '#fedc69',
    '#ff698f',
    '#26deca',
    '#ffb869',
    '#7969ff',
    '#ff6969',
    '#69ff9e',
    '#69aaff',
    '#c269ff',
    '#ffd769',
    '#69ffd1',
    '#a769ff',
    '#69cfff',
    '#ff69d3',
    '#94ff69',
    '#69ffb0'
  ];
  const { domRef, updateOptions } = useEcharts(() => ({
    legend: {
      bottom: '5%',
      itemStyle: {
        borderWidth: 0
      },
      left: 'center'
    },
    series: [
      {
        avoidLabelOverlap: false,
        center: ['50%', '40%'],
        color: pieChartColors,
        data: [] as IData[],
        emphasis: {
          label: {
            fontSize: '12',
            show: true
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderRadius: 10,
          borderWidth: 1
        },
        label: {
          position: 'center',
          show: false
        },
        labelLine: {
          show: false
        },
        radius: ['45%', '75%'],
        type: 'pie'
      }
    ],
    tooltip: {
      trigger: 'item'
    }
  }));

  // 查询数据
  useEffect(() => {
    const queryData = async () => {
      const data = await fetchQueryArticleCategoryPieChart();
      if (data === null) return;
      const arr: IData[] = data.map(item => ({ name: item.categoryName, value: item.articleCount }));
      setChartData(arr);
    };
    queryData();
  }, []);

  // 2. 等图表初始化完成 + 数据回来 → 再渲染
  useEffect(() => {
    if (!domRef || !chartData) return; // 图表没准备好就不执行

    updateOptions(opts => {
      opts.series[0].data = chartData;
      return opts;
    });
  }, [chartData, updateOptions, domRef]);

  return (
    <ACard
      className="card-wrapper"
      variant="borderless"
    >
      <div
        className="h-360px overflow-hidden"
        ref={domRef}
      />
    </ACard>
  );
};

export default PieChart;
