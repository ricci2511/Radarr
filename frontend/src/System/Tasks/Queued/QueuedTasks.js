import PropTypes from 'prop-types';
import React from 'react';
import FieldSet from 'Components/FieldSet';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import translate from 'Utilities/String/translate';
import QueuedTaskRowConnector from './QueuedTaskRowConnector';

const columns = [
  {
    name: 'trigger',
    get label() {
      return translate('Trigger');
    },
    isVisible: true
  },
  {
    name: 'commandName',
    get label() {
      return translate('Name');
    },
    isVisible: true
  },
  {
    name: 'queued',
    get label() {
      return translate('Queued');
    },
    isVisible: true
  },
  {
    name: 'started',
    get label() {
      return translate('Started');
    },
    isVisible: true
  },
  {
    name: 'ended',
    get label() {
      return translate('Ended');
    },
    isVisible: true
  },
  {
    name: 'duration',
    get label() {
      return translate('Duration');
    },
    isVisible: true
  },
  {
    name: 'actions',
    isVisible: true
  }
];

function QueuedTasks(props) {
  const {
    isFetching,
    isPopulated,
    items
  } = props;

  return (
    <FieldSet legend={translate('Queue')}>
      {
        isFetching && !isPopulated &&
          <LoadingIndicator />
      }

      {
        isPopulated &&
          <Table
            columns={columns}
          >
            <TableBody>
              {
                items.map((item) => {
                  return (
                    <QueuedTaskRowConnector
                      key={item.id}
                      {...item}
                    />
                  );
                })
              }
            </TableBody>
          </Table>
      }
    </FieldSet>
  );
}

QueuedTasks.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isPopulated: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired
};

export default QueuedTasks;
