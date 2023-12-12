import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// This function fetches the root regions for a given hierarchy. It takes a hierarchyId as a parameter and returns an array of root regions or an empty array if an error occurs.
export const fetchRootRegions = async (hierarchyId) => {
  try {
    const response = await api.get('/api/regions/root', { params: { hierarchyId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching root regions:', error);
    return [];
  }
};

// This function fetches the subregions for a given region and hierarchy. It takes a regionId and a hierarchyId as parameters and returns an array of subregions or an empty array if an error occurs.
export const fetchSubregions = async (regionId, hierarchyId) => {
  try {
    const response = await api.get(`/api/regions/${regionId}/subregions`, { params: { hierarchyId } });
    if (response.status === 204) {
      return null;
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching subregions:', error);
    return [];
  }
};

// This function fetches a region for a given hierarchy. It takes a regionId and a hierarchyId as parameters and returns the region data or an empty array if an error occurs.
export const fetchRegion = async (regionId, hierarchyId) => {
  try {
    const response = await api.get(`/api/regions/${regionId}`, { params: { hierarchyId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching region:', error);
    return [];
  }
};

// This function fetches the geometry for a given region and hierarchy. It takes a regionId, a hierarchyId, and a force flag as parameters. The force flag determines whether to resolve empty geometries. The function returns the region geometry data or null if no geometry is found or an error occurs.
// Fetch the geometry for a region. Returns null if no geometry is found.
export const fetchRegionGeometry = async (regionId, hierarchyId, force) => {
  try {
    const response = await api.get(`/api/regions/${regionId}/geometry`, { params: { resolveEmpty: force, hierarchyId } });
    if (response.status === 204 || response.status === 404) {
      return null;
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching region geometry:', error);
    throw new Error(`Error fetching region geometry: ${error.message}`);
  }
};

// This function fetches the ancestors for a given region and hierarchy. It takes a regionId and a hierarchyId as parameters and returns an array of ancestors or an empty array if an error occurs.
export const fetchAncestors = async (regionId, hierarchyId) => {
  try {
    const response = await api.get(`/api/regions/${regionId}/ancestors`, { params: { hierarchyId } });
    if (response.status === 204) {
      return [];
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching ancestors:', error);
    return [];
  }
};

// This function fetches all hierarchies. It takes no parameters and returns an array of hierarchies or an empty array if an error occurs.
export const fetchHierarchies = async () => {
  try {
    const response = await api.get('/api/regions/hierarchies');
    return response.data;
  } catch (error) {
    console.error('Error fetching hierarchies:', error);
    return [];
  }
};
