import axios from "../axios";

const getAllBusRoutes = () => {
  return axios.get("/api/list-bus-route");
};

const addBusRoute = (data) => {
  return axios.post("/api/add-new-route", {
    busStationFromId: data.busStationFromId,
    busStationToId: data.busStationToId,
    distance: data.distance,
    travelTime: data.travelTime,
  });
};

const updateBusRouteById = (id, data) => {
  return axios.put(`/api/update-route/${id}`, data);
};

const disableBusRouteById = (id) => {
  return axios.delete(`/api/delete-route/${id}`);
};

const enableBusRouteById = (id) => {
  return axios.put(`/api/restore-route/${id}`);
};

const handleFilterBusRoutes = (data) => {
  return axios.post("/api/filter-route", {
    from: data.from,
    to: data.to,
    distance: data.distance,
    travelTime: data.travelTime,
    status: data.status,
  });
};

export { 
  getAllBusRoutes,
  addBusRoute,
  updateBusRouteById,
  disableBusRouteById,
  enableBusRouteById,
  handleFilterBusRoutes
 };
