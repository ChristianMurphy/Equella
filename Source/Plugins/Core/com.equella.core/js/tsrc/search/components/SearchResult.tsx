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
import * as React from "react";
import { SyntheticEvent } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import { languageStrings } from "../../util/langstrings";
import ReactHtmlParser from "react-html-parser";
import {
  Divider,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Theme,
  Typography,
  Grid,
  Badge,
} from "@material-ui/core";
import { Date as DateDisplay } from "../../components/Date";
import {
  AttachFile,
  ExpandMore,
  InsertDriveFile,
  Search,
} from "@material-ui/icons";
import * as OEQ from "@openequella/rest-api-client";
import { Link } from "react-router-dom";
import { routes } from "../../mainui/routes";
import OEQThumb from "../../components/OEQThumb";

const useStyles = makeStyles((theme: Theme) => {
  return {
    inline: {
      display: "inline",
    },
    heading: {
      fontWeight: "bold",
      paddingRight: theme.spacing(1),
    },
    itemDescription: {
      paddingBottom: theme.spacing(1),
    },
    additionalDetails: {
      flexDirection: "row",
      display: "flex",
      paddingTop: theme.spacing(1),
    },
    status: {
      textTransform: "capitalize",
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    attachmentExpander: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    attachmentBadge: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.secondary.main,
      borderRadius: "50%",
    },
  };
});

export default function SearchResult({
  name,
  version,
  uuid,
  description,
  displayFields,
  modifiedDate,
  status,
  displayOptions,
  attachments,
  keywordFoundInAttachment,
  links,
}: OEQ.Search.SearchResultItem) {
  const classes = useStyles();

  const searchResultStrings = languageStrings.searchpage.searchresult;

  const [attachExapanded, setAttachExpanded] = React.useState(
    displayOptions?.standardOpen ?? false
  );

  const handleAttachmentPanelClick = (event: SyntheticEvent) => {
    /** prevents the SearchResult onClick from firing when attachment panel is clicked */
    event.stopPropagation();
    setAttachExpanded(!attachExapanded);
  };

  const itemMetadata = (
    <div className={classes.additionalDetails}>
      <Typography component="span" className={classes.status}>
        {status}
      </Typography>
      <Divider
        flexItem
        component="span"
        variant="middle"
        orientation="vertical"
      />
      <Typography component="span">
        {searchResultStrings.dateModified}&nbsp;
        <DateDisplay displayRelative date={new Date(modifiedDate)} />
      </Typography>
    </div>
  );

  const customDisplayMetadata = displayFields.map(
    (element: OEQ.Search.DisplayFields, index: number) => {
      return (
        <ListItem disableGutters dense key={element.name + index}>
          <Typography
            component="span"
            variant="body2"
            className={classes.heading}
            color="textPrimary"
          >
            {element.name}
          </Typography>
          <Typography
            component="span"
            variant="body2"
            className={classes.inline}
            color="textPrimary"
          >
            {
              /**Custom metadata can contain html tags, we should make sure that is
          preserved */
              ReactHtmlParser(element.html)
            }
          </Typography>
        </ListItem>
      );
    }
  );

  const generateAttachmentList = () => {
    const attachmentsList = attachments.map(
      (attachment: OEQ.Search.Attachment) => {
        return (
          <ListItem key={attachment.id} button className={classes.nested}>
            <ListItemIcon>
              <InsertDriveFile />
            </ListItemIcon>
            <ListItemText color="primary" primary={attachment.description} />
          </ListItem>
        );
      }
    );

    if (attachmentsList.length > 0)
      return (
        <Accordion
          className={classes.attachmentExpander}
          expanded={attachExapanded}
          onClick={(event) => handleAttachmentPanelClick(event)}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Badge
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  overlap="circle"
                  badgeContent={
                    keywordFoundInAttachment ? (
                      <Tooltip
                        title={searchResultStrings.keywordFoundInAttachment}
                        aria-label={
                          searchResultStrings.keywordFoundInAttachment
                        }
                      >
                        <Search
                          fontSize="small"
                          className={classes.attachmentBadge}
                        />
                      </Tooltip>
                    ) : undefined
                  }
                >
                  <AttachFile />
                </Badge>
              </Grid>
              <Grid item>
                <Typography>{searchResultStrings.attachments}</Typography>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <List component="div" disablePadding>
              {attachmentsList}
            </List>
          </AccordionDetails>
        </Accordion>
      );
    return null;
  };

  const itemLink = (
    <Link to={routes.ViewItem.to(uuid, version)}>{name ?? uuid}</Link>
  );

  return (
    <ListItem alignItems="flex-start" divider>
      <OEQThumb
        attachment={attachments[0]}
        showPlaceholder={displayOptions?.disableThumbnail ?? false}
      />
      <ListItemText
        primary={itemLink}
        secondary={
          <>
            <Typography className={classes.itemDescription}>
              {description}
            </Typography>
            <List disablePadding>{customDisplayMetadata}</List>
            {generateAttachmentList()}
            {itemMetadata}
          </>
        }
        primaryTypographyProps={{ color: "primary", variant: "h6" }}
        secondaryTypographyProps={{ component: "section" }}
      />
    </ListItem>
  );
}
