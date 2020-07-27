/*
 * Licensed to The Apereo Foundation under one or more contributor license
 * agreements. See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * The Apereo Foundation licenses this file to you under the Apache License,
 * Version 2.0, (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as OEQ from "@openequella/rest-api-client";
import { API_BASE_URL } from "../config";
import { SortOrder } from "./SearchSettingsModule";
import { Collection } from "./CollectionsModule";
import { DateRange } from "../components/DateRangeSelector";

export const defaultSearchOptions: SearchOptions = {
  rowsPerPage: 10,
  currentPage: 0,
  sortOrder: undefined,
  rawMode: false,
  dateRangeQuickModeEnabled: true,
};

export const defaultPagedSearchResult: OEQ.Common.PagedResult<OEQ.Search.SearchResultItem> = {
  start: 0,
  length: 10,
  available: 10,
  results: [],
};

/**
 * Helper function, to support formatting of query in raw mode. When _not_ raw mode
 * we append a wildcard to support the idea of a simple (typeahead) search.
 *
 * @param query the intended search query to be sent to the API
 * @param addWildcard whether a wildcard should be appended
 */
const formatQuery = (query: string, addWildcard: boolean): string => {
  const trimmedQuery = query ? query.trim() : "";
  const appendWildcard = addWildcard && trimmedQuery.length > 0;
  return trimmedQuery + (appendWildcard ? "*" : "");
};

/**
 * A function that takes search options and converts search options to search params,
 * and then does a search and returns a list of Items.
 * @param searchOptions  Search options selected on Search page.
 */
export const searchItems = ({
  query,
  rowsPerPage,
  currentPage,
  sortOrder,
  collections,
  rawMode,
  lastModifiedDateRange,
}: SearchOptions): Promise<
  OEQ.Common.PagedResult<OEQ.Search.SearchResultItem>
> => {
  // If query is undefined, then we want to keep 'undefined'; but otherwise let's pre-process it.
  const processedQuery = query ? formatQuery(query, !rawMode) : undefined;
  const searchParams: OEQ.Search.SearchParams = {
    query: processedQuery,
    start: currentPage * rowsPerPage,
    length: rowsPerPage,
    status: [
      "LIVE" as OEQ.Common.ItemStatus,
      "REVIEW" as OEQ.Common.ItemStatus,
    ],
    order: sortOrder,
    collections: collections?.map((collection) => collection.uuid),
    modifiedAfter: lastModifiedDateRange?.start?.toISOString(),
    modifiedBefore: lastModifiedDateRange?.end?.toISOString(),
  };
  return OEQ.Search.search(API_BASE_URL, searchParams);
};

/**
 * Type of all search options on Search page
 */
export interface SearchOptions {
  /**
   * The query string of the current search. Can be left blank for a default search.
   */
  query?: string;
  /**
   * The number of items displayed in one page.
   */
  rowsPerPage: number;
  /**
   * Selected page.
   */
  currentPage: number;
  /**
   * Selected search result sorting order.
   */
  sortOrder: SortOrder | undefined;
  /**
   * A list of collections.
   */
  collections?: Collection[];
  /**
   * Whether to send the `query` as is (true) or to apply some processing (such as appending
   * a wildcard operator).
   */
  rawMode: boolean;
  /**
   * A date range for Items' last modified dates.
   */
  lastModifiedDateRange?: DateRange;
  /**
   * Whether to enable Quick mode (true) or to use custom date pickers (false)
   */
  dateRangeQuickModeEnabled: boolean;
}
