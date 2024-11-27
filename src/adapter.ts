/* eslint-disable max-lines */


import { EventDetail, GroupedEvent, OptionalTimestamp } from '@castore/core';
import axios, { AxiosError } from 'axios';

export declare type EventsQueryOptions = {
    minVersion?: number;
    maxVersion?: number;
    limit?: number;
    reverse?: boolean;
    hashed?: boolean; 
};
export declare type EventStoreContext = {
    eventStoreId: string;
};
export declare type PushEventOptions = EventStoreContext & {
    force?: boolean;
};
export declare type ListAggregateIdsOptions = {
    limit?: number;
    pageToken?: string;
    initialEventAfter?: string;
    initialEventBefore?: string;
    reverse?: boolean;
};
export declare type ListAggregateIdsOutput = {
    aggregateIds: {
        aggregateId: string;
        initialEventTimestamp: string;
    }[];
    nextPageToken?: string;
};
export interface EventStorageAdapter {
    getEvents: (aggregateId: string, context: EventStoreContext, options?: EventsQueryOptions) => Promise<{
        events: EventDetail[];
    }>;
    pushEvent: (eventDetail: OptionalTimestamp<EventDetail>, options: PushEventOptions) => Promise<{
        event: EventDetail;
    }>;
    pushEventGroup: (options: {
        force?: boolean;
    }, ...groupedEvents: [GroupedEvent, ...GroupedEvent[]]) => Promise<{
        eventGroup: {
            event: EventDetail;
        }[];
    }>;
    groupEvent: (eventDetail: OptionalTimestamp<EventDetail>) => GroupedEvent;
    listAggregateIds: (context: EventStoreContext, options?: ListAggregateIdsOptions) => Promise<ListAggregateIdsOutput>;
}


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
      { minVersion, maxVersion, reverse, limit, hashed } = {},
    ) => {
      const url = hashed ? `${this.endpointUrl}/castore/getEventsNoHashed` : `${this.endpointUrl}/castore/getEvents`;
      return axios.get(url, {
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
      .catch((error: Error | AxiosError) => {
        if (axios.isAxiosError(error))  {
          const errorStatus = error.response?.status;
          const errorData = error.response?.data;
          console.error('error cought getting events', {
            errorStatus,
            errorData
          });
        } else {
          console.error('error cought getting events', {
            errorStatus: 500,
            errorData: {}
          })
        }

        throw new Error('Fail to get events');
      })
    };

    this.pushEvent = async (eventWithOptTimestamp, options) => {
     
      return axios.post(`${this.endpointUrl}/castore/pushEvent`, {
        eventDetail: eventWithOptTimestamp,
        options
      })
      .then(({ data }) => data)
      .catch((error: Error | AxiosError) => {
        if (axios.isAxiosError(error))  {
          const errorStatus = error.response?.status;
          const errorData = error.response?.data;
          console.error('error cought pushing event', {
            errorStatus,
            errorData
          });
        } else {
          console.error('error cought pushing event', {
            errorStatus: 500,
            errorData: {}
          })
        }

        throw new Error('Fail to push event');
      });
    };

    /**
     * @debt test "Add  unit test for pushEventGroup"
     */
    this.pushEventGroup = async (options, ...groupedEventsInput) => {
      return axios.post(`${this.endpointUrl}/castore/pushEventGroup`, {
        options,
        groupedEvents: groupedEventsInput
      }).then(({ data }) => data)
      .catch((error: Error | AxiosError) => {
        if (axios.isAxiosError(error))  {
          const errorStatus = error.response?.status;
          const errorData = error.response?.data;
          console.error('error cought pushing event group', {
            errorStatus,
            errorData
          });
        } else {
          console.error('error cought pushing event group', {
            errorStatus: 500,
            errorData: {}
          })
        }

        throw new Error('Fail to push event group');
      });
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
      .catch((error: Error | AxiosError) => {
        if (axios.isAxiosError(error))  {
          const errorStatus = error.response?.status;
          const errorData = error.response?.data;
          console.error('error cought listing aggregate IDs', {
            errorStatus,
            errorData
          });
        } else {
          console.error('error cought listing aggregate IDs', {
            errorStatus: 500,
            errorData: {}
          })
        }

        throw new Error('Fail to list aggregate IDs');
      });
    };
  }
}
