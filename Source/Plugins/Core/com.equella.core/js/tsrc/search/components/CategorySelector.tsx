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
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ReactElement, useState } from "react";
import * as React from "react";
import * as OEQ from "@openequella/rest-api-client";
import {
  Classification,
  SelectedCategories,
} from "../../modules/SearchFacetsModule";
import { languageStrings } from "../../util/langstrings";

const useStyles = makeStyles({
  classificationList: {
    maxHeight: 500,
    overflow: "auto",
  },
});

export interface CategorySelectorProps {
  /**
   * A list of Classifications which will be rendered to sections for each
   * Classifications under which will be the categories as clickable checkboxes.
   */
  classifications: Classification[];
  /**
   * A list of selected categories which are grouped by their Classification ID.
   */
  selectedCategories?: SelectedCategories[];
  /**
   * Handler for selecting/deselecting categories.
   * @param terms A list of currently selected terms.
   */
  onSelectedCategoriesChange: (categories: SelectedCategories[]) => void;
}

export const CategorySelector = ({
  classifications,
  selectedCategories = [],
  onSelectedCategoriesChange,
}: CategorySelectorProps) => {
  const classes = useStyles();
  const [expandedClassifications, setExpandedClassifications] = useState<
    Map<number, boolean>
  >(
    new Map(classifications.map((classification) => [classification.id, false]))
  );

  /**
   * Handler for clicking the 'SHOW MORE' and 'SHOW LESS' buttons.
   * @param classificationID The ID of a Classification whose SHOW MORE' and 'SHOW LESS' buttons is clicked.
   * @param expanded Whether the section of this Classification is expanded or not.
   */
  const onShowMore = (classificationID: number, expanded: boolean) => {
    const copiedMap = new Map(expandedClassifications);
    copiedMap.set(classificationID, expanded);
    setExpandedClassifications(copiedMap);
  };

  /**
   * The list of selected categories are grouped by Classification ID.
   * If there is a group matching the ID, then update this group's selected categories,
   * and otherwise add a new group for the ID and its firstly selected category.
   *
   * @param classificationID The ID of a Classification
   * @param category The selected or unselected category
   */
  const handleSelectCategories = (
    classificationID: number,
    category: string
  ) => {
    const categoryGroupIndex = selectedCategories.findIndex(
      (c) => c.id === classificationID
    );
    const copiedCategoryGroups = [...selectedCategories];

    // If there is no group for this category then add a new group,
    // and otherwise update the category list of this group.
    if (categoryGroupIndex === -1) {
      copiedCategoryGroups.push({
        id: classificationID,
        categories: [category],
      });
    } else {
      const copiedSelectedCategories = [
        ...selectedCategories[categoryGroupIndex].categories,
      ];
      const categoryIndex = copiedSelectedCategories.indexOf(category);
      if (categoryIndex === -1) {
        copiedSelectedCategories.push(category);
      } else {
        copiedSelectedCategories.splice(categoryIndex, 1);
      }
      copiedCategoryGroups.splice(categoryGroupIndex, 1, {
        id: classificationID,
        categories: copiedSelectedCategories,
      });
    }

    onSelectedCategoriesChange(copiedCategoryGroups);
  };

  /**
   * Create a button to show more/less categories for each Classification.
   * @param classificationID The ID of a Classification.
   * @param expanded Whether the section of a Classification has been expanded or not.
   */
  const showMoreButton = (
    classificationID: number,
    expanded: boolean
  ): ReactElement => (
    <ListItem>
      <Grid container justify="center">
        <Grid item>
          <Button
            variant="text"
            onClick={() => onShowMore(classificationID, !expanded)}
          >
            {expanded
              ? languageStrings.searchpage.categorySelector.showLessButton
              : languageStrings.searchpage.categorySelector.showMoreButton}
          </Button>
        </Grid>
      </Grid>
    </ListItem>
  );

  /**
   * Generate texts in the format of 'term (count)' for displaying a Category.
   * @param category The text of a category
   * @param count The count of a category
   */
  const categoryLabel = ({
    term: category,
    count,
  }: OEQ.SearchFacets.Facet): ReactElement => (
    <Grid container spacing={1}>
      <Grid item>
        <Typography>{category}</Typography>
      </Grid>
      <Grid item>
        <Typography color="textSecondary">{`(${count})`}</Typography>
      </Grid>
    </Grid>
  );

  /**
   * Build a ListItem consisting of a MUI Checkbox and a Label for a category.
   * @param classificationID The ID of a Classification
   * @param category A category to be displayed
   */
  const categoryListItem = (
    classificationID: number,
    category: OEQ.SearchFacets.Facet
  ): ReactElement => {
    const { term } = category;
    return (
      <ListItem key={`${classificationID}:${term}`} style={{ padding: 0 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={
                selectedCategories
                  ?.find((c) => c.id === classificationID)
                  ?.categories?.includes(term) ?? false
              }
              onChange={() => handleSelectCategories(classificationID, term)}
            />
          }
          label={categoryLabel(category)}
        />
      </ListItem>
    );
  };

  /**
   * Build a list for a Classification's categories. Some categories may have facets
   * not displayed due to the configured maximum display number.
   *
   * @param id The ID of a Classification
   * @param categories A list of terms to build into a list
   * @param maxDisplay Default maximum number of displayed facets
   * @param expanded Whether to show more categories or not
   */
  const listCategories = (
    { id, categories, maxDisplay }: Classification,
    expanded: boolean
  ): ReactElement[] => {
    const selectedTerms: string[] =
      selectedCategories?.find((c) => c.id === id)?.categories ?? [];

    // Previously selected categories that still apply to current search criteria.
    const selectedAndExist = categories.filter((c) =>
      selectedTerms.includes(c.term)
    );

    // Previously selected categories that do not apply to current search criteria.
    // Their counts should be 0.
    const selectedButDisappear = selectedTerms
      .filter((t) => categories.every((c) => c.term !== t))
      .map((t) => ({ term: t, count: 0 }));

    // Categories that apply to current search criteria but have not been selected.
    const noSelected = categories.filter(
      (c) => !selectedTerms.includes(c.term)
    );
    // The concatenating order is selectedAndExist -> selectedButDisappear -> noSelected.
    const orderedFacets: OEQ.SearchFacets.Facet[] = [
      ...selectedAndExist,
      ...selectedButDisappear,
      ...noSelected,
    ];

    return orderedFacets
      .slice(0, expanded ? undefined : maxDisplay)
      .map((facet) => categoryListItem(id, facet));
  };

  /**
   * Sort and build Classifications that have categories.
   * For each Classification, a scroll bar and a 'Show more' button may or may not
   * be added, depending on whether a classification has more categories to show or not.
   */
  const buildClassifications: ReactElement[] = classifications
    .filter((classification) => classification.categories.length > 0)
    .sort(
      (prevClassification, nextClassification) =>
        prevClassification.orderIndex - nextClassification.orderIndex
    )
    .map((classification) => {
      const { id, name, categories, maxDisplay } = classification;
      const expanded = expandedClassifications.get(id) ?? false;
      return (
        <ListItem divider key={id}>
          <Grid container direction="column">
            <Grid item>
              <Typography variant="subtitle1">{name}</Typography>
            </Grid>
            <Grid item>
              <List
                dense
                className={expanded ? classes.classificationList : ""}
              >
                {listCategories(classification, expanded)}
                {categories.length > maxDisplay && showMoreButton(id, expanded)}
              </List>
            </Grid>
          </Grid>
        </ListItem>
      );
    });

  return <List>{buildClassifications}</List>;
};
