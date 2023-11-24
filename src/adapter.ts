/* eslint-disable max-lines */

import type {
  Aggregate,
  EventDetail,
  EventStorageAdapter,
} from '@castore/core';
import { GroupedEvent } from '@castore/core';
import axios from 'axios';


const prefixAggregateId = (eventStoreId: string, aggregateId: string): string =>
  `${eventStoreId}#${aggregateId}`;

const unprefixAggregateId = (
  eventStoreId: string,
  aggregateId: string,
): string =>
  aggregateId.startsWith(`${eventStoreId}#`)
    ? aggregateId.slice(eventStoreId.length + 1)
    : aggregateId;

type DynamoDBSingleTableGroupedEvent<
  EVENT_DETAILS extends EventDetail = EventDetail,
  AGGREGATE extends Aggregate = Aggregate,
> = GroupedEvent<EVENT_DETAILS, AGGREGATE> & {
  eventStorageAdapter: ZimplificaEventStorageAdapter;
};

export class ZimplificaEventStorageAdapter
  implements EventStorageAdapter
{
  getEvents: EventStorageAdapter['getEvents'];
  pushEvent: EventStorageAdapter['pushEvent'];
  pushEventGroup: EventStorageAdapter['pushEventGroup'];
  groupEvent: EventStorageAdapter['groupEvent'];
  listAggregateIds: EventStorageAdapter['listAggregateIds'];


  endpointUrl: string ;

  constructor({
    endpointUrl,
  }: {
    endpointUrl: string
  }) {
    this.endpointUrl = endpointUrl;

    // eslint-disable-next-line complexity
    this.getEvents = async (
      aggregateId,
      { eventStoreId },
      { minVersion, maxVersion, reverse, limit } = {},
    ) => {
      return axios.get(`${this.endpointUrl}/castore/getEvents`, {
        data: {
          aggregateId,
          context: {
            eventStoreId
          },
          options: {
            minVersion,
            maxVersion,
            reverse,
            limit
          }
        }
      }).then(({ data }) => data)
    };

  
    this.pushEvent = async (eventWithOptTimestamp, options) => {
     
      return axios.post(`${this.endpointUrl}/castore/pushEvent`, {
        eventDetail: eventWithOptTimestamp,
        options
      }).then(({ data }) => data)
    };

    /**
     * @debt test "Add  unit test for pushEventGroup"
     */
    this.pushEventGroup = async (options, ...groupedEventsInput) => {
      return axios.post(`${this.endpointUrl}/castore/pushEventGroup`, {
        options,
        groupedEvents: groupedEventsInput
      }).then(({ data }) => data)
    };

    this.groupEvent = event =>
      new GroupedEvent({ event, eventStorageAdapter: this });

    // eslint-disable-next-line complexity
    this.listAggregateIds = async (
      { eventStoreId },
      { pageToken: inputPageToken, ...inputOptions } = {},
    ) => {
      return axios.get(`${this.endpointUrl}/castore/listAggregateIds`, {
        data: {
          context: { eventStoreId },
          options: { pageToken: inputPageToken, ...inputOptions }
        }
      }).then(({ data }) => data)
    };
  }
}
