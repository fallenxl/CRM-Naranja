import { useEffect, useState } from "react";
import { Layout } from "../Layout";
import { getDashboardService } from "../../services/dashboard.services";
import ReactECharts from "echarts-for-react";
import { PhoneArrowDownLeftIcon, UsersIcon } from "@heroicons/react/24/outline";

const tabs = [
  { label: "Por Canal", key: "channel" },
  { label: "Por Edad", key: "age" },
  { label: "Por País", key: "country" },
  { label: "Por Ciudad", key: "city" },
];

function Dashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [option, setOption] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("channel");
  const [interval, setInterval] = useState<any>({
    startDate: '',
    endDate: ''
  });

  const handleInterval = (e: any) => {
    setInterval({
      ...interval,
      [e.target.name]: e.target.value
    });
  }

  useEffect(() => {
    getDashboardService(interval).then((response: any) => {
      setDashboardData(response?.data);
      console.log(response?.data);
      let dataX = response?.data?.leadsByStatus
      if(response?.data?.leadsStatusByDate ){
        dataX = response?.data?.leadsStatusByDate
      }

      setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        xAxis: {
          data: ["Prospectos"],
        },
        yAxis: {

        },
        series: dataX.map((item: any) => {
          return {
            name: item.status?? item._id,
            type: "bar",
            data: [item.count],
          };
        }),
      });
    });
  }, [interval.startDate, interval.endDate]);

  const renderTableData = () => {
    let data = [];
    switch (activeTab) {
      case "channel":
        data = dashboardData?.leadsByChannel || [];
        break;
      case "age":
        data = dashboardData?.leadsByAge || [];
        break;
      case "country":
        data = dashboardData?.leadsByCountry || [];
        break;
      case "city":
        data = dashboardData?.leadsByCity || [];
        break;
      default:
        break;
    }
    return data;
  };

  const renderTableHeaders = () => {
    switch (activeTab) {
      case "channel":
        return (
          <>
            <th>Canal</th>
            <th>Prospectos</th>
          </>
        );
      case "age":
        return (
          <>
            <th>Edad</th>
            <th>Prospectos</th>
          </>
        );
      case "country":
        return (
          <>
            <th>País</th>
            <th>Prospectos</th>
          </>
        );
      case "city":
        return (
          <>
            <th>Ciudad</th>
            <th>Prospectos</th>
          </>
        );
      default:
        break;
    }
  };


  const renderAdvisorTable = () => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md mt-4 col-start-1 col-end-5  md:max-h-[21.5rem] overflow-auto">
        <h2 className="text-xl font-semibold">Prospectos por Asesor</h2>
        {/* Filter by date */}
        <div className="mb-6">
          <small className="text-gray-500 ">Cantidad de prospectos por asesor</small>
        </div>

        <div className="overflow-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="text-left bg-gray-100">
                <th>Asesor</th>
                <th>Prospectos</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData?.leadsByAdvisor?.sort(
                (a: any, b: any) => b.count - a.count
              ).map((item: any, index: number) => (
                <tr key={index} className={`border border-gray-300 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}>
                  <td className="p-2">{item.advisor}</td>
                  <td className="p-2">{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <Layout title="Dashboard">
      <div className="grid  md:grid-cols-3 lg:grid-cols-4 gap-4 text-gray-800 w-full">
        <div className="bg-white p-4 rounded-lg shadow-md px-10">
          <h2 className="text-xl font-semibold pb-5 flex items-center justify-between">Total Prospectos<UsersIcon className="h-6 w-6" /></h2>
          <p className="text-3xl font-semibold">{dashboardData?.totalLeads}</p>
          <small className="text-gray-500">Desde el inicio</small>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md px-10">
          <h2 className="text-xl font-semibold pb-5 flex justify-between">
            Total pendientes de llamar
            <PhoneArrowDownLeftIcon className="h-6 w-6" />

          </h2>
          <p className="text-3xl font-semibold">
            {dashboardData?.leadsPendingCall}

          </p>
          <small className="text-gray-500">Desde el inicio</small>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md md:col-span-2 row-start-4 md:row-start-2 lg:col-span-2">
          <h2 className="text-xl font-semibold pb-2">Gráfico de Prospectos por Estado</h2>
          <small className="text-gray-500">Filtrar por fecha y estado</small>

          <div className="mb-4 flex flex-wrap mt-3">
            <div className="flex w-full gap-4">
              <div className="flex flex-col gap-2 flex-grow ">
                <label className="mr-2">Desde:</label>
                <input
                  name="startDate"
                  onChange={handleInterval}
                  type="date"
                  className="border border-gray-300 p-2 rounded-md mr-4 w-full"
                />
              </div>
              <div className="flex flex-col gap-2 flex-grow ">
                <label className="mr-2">Hasta:</label>
                <input

                  name="endDate"
                  onChange={handleInterval}
                  type="date"
                  className="border border-gray-300 p-2 rounded-md mr-4 w-full"
                />
              </div>
            </div>
          </div>
          {option && <ReactECharts option={option} className="text-sm" />}
          {option?.series[0]?.data?.length === 0 && <div className="text-center text-gray-500 absolute top-[60%] left-[15%] md:left-[20%]">No hay datos para mostrar</  div>}
        </div>
        <div className="w-full md:col-span-1 row-start-3 lg:col-start-3 lg:col-end-5 lg:row-span-3 "   >
          <div className="bg-white p-4 rounded-lg shadow-md w-full md:col-span-1 row-start-3 lg:col-start-3 lg:col-end-5 lg:row-span-3 md:max-h-[21.5rem] overflow-auto">
            <h2 className="text-xl font-semibold">Prospectos</h2>
            <div className="mb-2">
              <small className="text-gray-500">Filtrar por:</small>
            </div>
            <div className="mb-4">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`px-4 py-2 mr-2 mb-2 ${activeTab === tab.key
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                    }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="overflow-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="text-left bg-gray-100">
                    {renderTableHeaders()}
                  </tr>
                </thead>
                <tbody>
                  {renderTableData().
                    sort((a: any, b: any) => b.count - a.count)
                    .map((item: any, index: number) => (
                      <tr
                        key={index}
                        className={`border border-gray-300 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                          }`}
                      >
                        <td className="p-2">
                          {item._id ??
                            item.age ??
                            item.country ??
                            item.city ??
                            "Sin registrar"}
                        </td>
                        <td className="p-2">{item.count}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

          </div>
          {renderAdvisorTable()}
        </div>

      </div>
    </Layout>
  );
}

export default Dashboard;
