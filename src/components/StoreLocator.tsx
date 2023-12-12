import * as React from "react";
import { useState } from "react";
import {
  MapboxMap,
  FilterSearch,
  OnSelectParams,
  VerticalResults,
} from "@yext/search-ui-react";
import {
  Matcher,
  SelectableStaticFilter,
  useSearchActions,
} from "@yext/search-headless-react";
// Mapbox CSS bundle
import "mapbox-gl/dist/mapbox-gl.css";
import MapPin from "./MapPin"; // New
import LocationCard from "./LocationCard";

import { createCtx } from "../utils/createContext";

type MapContextType = {
  hoveredLocationId: string;
  setHoveredLocationId: (value: string) => void;
};

export const [useMapContext, MapContextProvider] = createCtx<MapContextType>(
  "Attempted to call useMapContext outside of MapContextProvider"
);

const StoreLocator = (): JSX.Element => {
  const [hoveredLocationId, setHoveredLocationId] = useState("");

  const searchActions = useSearchActions();

  const handleFilterSelect = (params: OnSelectParams) => {
    const locationFilter: SelectableStaticFilter = {
      selected: true,
      filter: {
        kind: "fieldValue",
        fieldId: params.newFilter.fieldId,
        value: params.newFilter.value,
        matcher: Matcher.Equals,
      },
    };
    searchActions.setStaticFilters([locationFilter]);
    searchActions.executeVerticalQuery();
  };

  return (
    <MapContextProvider value={{ hoveredLocationId, setHoveredLocationId }}>
      <div className="flex h-[calc(100vh-210px)] border">
        <div className="w-1/3 flex flex-col">
          <FilterSearch
            onSelect={handleFilterSelect}
            placeholder="Find Locations Near You"
            searchFields={[
              {
                entityType: "location",
                fieldApiName: "builtin.location",
              },
            ]}
          />
          <VerticalResults
            customCssClasses={{ verticalResultsContainer: "overflow-y-auto" }}
            CardComponent={LocationCard}
          />
        </div>
        <div className="w-2/3">
          <MapboxMap
            mapboxAccessToken={YEXT_PUBLIC_MAPBOX_API_KEY || ""}
            PinComponent={(props) => (
              <MapPin
                {...props}
                hoveredLocationId={hoveredLocationId}
                setHoveredLocationId={setHoveredLocationId}
              />
            )}
          />
        </div>
      </div>
    </MapContextProvider>
  );
};

export default StoreLocator;
