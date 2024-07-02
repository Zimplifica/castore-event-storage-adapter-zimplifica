/* eslint-disable max-lines */

import type {
  EventStorageAdapter,
} from '@castore/core';
import { GroupedEvent } from '@castore/core';
import axios, { AxiosError } from 'axios';


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
