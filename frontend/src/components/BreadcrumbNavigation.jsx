import React, { useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { ButtonBase, Typography } from '@mui/material';
import { useNavigation } from './NavigationContext';
import { fetchAncestors, fetchRegion } from '../api';

function BreadcrumbNavigation() {
  const { selectedRegion, setSelectedRegion, selectedHierarchy } = useNavigation();
  const [breadcrumbItems, setBreadcrumbItems] = useState([{ id: null, name: 'World', hasSubregions: true }]);

  useEffect(() => {
    const fetchAndSetAncestors = async () => {
      if (selectedRegion.id !== null && selectedRegion.id !== 0) {
        const ancestors = await fetchAncestors(selectedRegion.id, selectedHierarchy.hierarchyId);
        if (Array.isArray(ancestors)) {
          const reversedAncestors = ancestors.reverse();
          setBreadcrumbItems([{ id: 0, name: 'World', hasSubregions: true }, ...reversedAncestors]);
        } else {
          console.error('Ancestors is not an array:', ancestors);
        }
      } else {
        setBreadcrumbItems([{ id: null, name: 'World', hasSubregions: true }]);
      }
    };
    fetchAndSetAncestors();
  }, [selectedRegion, selectedHierarchy]);

  const handleBreadcrumbClick = async (regionId, regionName, index) => {
    let hasSubregions;
    if (regionId === null || regionId === 0) {
      hasSubregions = true;
    } else {
      try {
        const region = await fetchRegion(regionId, selectedHierarchy.hierarchyId);
        hasSubregions = region.hasSubregions;
      } catch (error) {
        console.error(`Error fetching region ${regionId}, consider the region as not having subregions:`, error);
        hasSubregions = false;
      }
    }
    setSelectedRegion({
      id: regionId,
      name: regionName,
      hasSubregions,
    });
    // Truncate the breadcrumbItems array up to the clicked index + 1
    setBreadcrumbItems((prevItems) => prevItems.slice(0, index + 1));
  };

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {breadcrumbItems.map((item, index) => (
        <Typography
          color="inherit"
          key={item.id}
          style={{ cursor: 'pointer' }}
        >
          <ButtonBase component="button" onClick={() => handleBreadcrumbClick(item.id, item.name, index)}>
            {item.name}
          </ButtonBase>
        </Typography>
      ))}
    </Breadcrumbs>
  );
}

export default BreadcrumbNavigation;
