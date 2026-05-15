import { fetchQueryArticleLineChart } from '@/service/api';

const LineChart = () => {
  const [chartData, setChartData] = useState<Api.Blog.ArticleLineChart | null>(null);
  const { domRef, updateOptions } = useEcharts(() => ({
    grid: {
      bottom: '3%',
      containLabel: true,
      left: '3%',
      right: '4%'
    },
    legend: {
      data: ['已发布', '草稿']
    },
    series: [
      {
        areaStyle: {
          color: {
            colorStops: [
              {
                color: '#8e9dff',
                offset: 0.25
              },
              {
                color: '#fff',
                offset: 1
              }
            ],
            type: 'linear',
            x: 0,
            x2: 0,
            y: 0,
            y2: 1
          }
        },
        color: '#8e9dff',
        data: [] as number[],
        emphasis: {
          focus: 'series'
        },
        name: '已发布',
        smooth: true,
        stack: 'Total',
        type: 'line'
      },
      {
        areaStyle: {
          color: {
            colorStops: [
              {
                color: '#26deca',
                offset: 0.25
              },
              {
                color: '#fff',
                offset: 1
              }
            ],
            type: 'linear',
            x: 0,
            x2: 0,
            y: 0,
            y2: 1
          }
        },
        color: '#26deca',
        data: [] as number[],
        emphasis: {
          focus: 'series'
        },
        name: '草稿',
        smooth: true,
        stack: 'Total',
        type: 'line'
      }
    ],
    tooltip: {
      axisPointer: {
        label: {
          backgroundColor: '#6a7985'
        },
        type: 'cross'
      },
      trigger: 'axis'
    },
    xAxis: {
      boundaryGap: false,
      data: [] as string[],
      type: 'category'
    },
    yAxis: {
      type: 'value'
    }
  }));

  // 1. 先请求数据
  useEffect(() => {
    const queryData = async () => {
      const data = await fetchQueryArticleLineChart();
      if (data === null) return;
      setChartData(data);
    };
    queryData();
  }, []);

  // 2. 等图表初始化完成 + 数据回来 → 再渲染
  useEffect(() => {
    if (!domRef || !chartData) return; // 图表没准备好就不执行

    updateOptions(opts => {
      opts.xAxis.data = chartData.ymList;
      opts.series[0].data = chartData.publishedCntList;
      opts.series[1].data = chartData.draftCntList;
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

export default LineChart;
