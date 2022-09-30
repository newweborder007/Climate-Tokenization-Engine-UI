import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Tab,
  Tabs,
  TabPanel,
  DownloadIcon,
  H3,
  DataTable,
} from '../components';
import { getUntokenizedUnits } from '../store/actions/appActions';
import constants from '../constants';

const StyledSectionContainer = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledHeaderContainer = styled('div')`
  display: flex;
  align-items: center;
  padding: 30px 24px 14px 16px;
`;

// const StyledSearchContainer = styled('div')`
//   max-width: 25.1875rem;
// `;

// const StyledFiltersContainer = styled('div')`
//   margin: 0rem 1.2813rem;
// `;

const StyledSubHeaderContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 27.23px;
`;

const StyledBodyContainer = styled('div')`
  flex-grow: 1;
`;

const NoDataMessageContainer = styled('div')`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const StyledCSVOperationsContainer = styled('div')`
  display: flex;
  justify-content: flex-end;
  gap: 20px;

  svg {
    cursor: pointer;
  }
`;

const CreateTokens = () => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const pageContainerRef = useRef(null);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const { untokenizedUnits, paginationNrOfPages } = useSelector(store => store);

  useEffect(() => {
    dispatch(
      getUntokenizedUnits({
        page: page,
        resultsLimit: constants.TABLE_ROWS,
        searchQuery: 'testing',
        isRequestMocked: true,
      }),
    );
  }, [page]);

  const handleTabChange = useCallback(
    (event, newValue) => {
      setTabValue(newValue);
    },
    [setTabValue],
  );

  const untokenizedUnitsKeysToBeDisplayed = useMemo(
    () => [
      'unitOwner',
      'countryJurisdictionOfOwner',
      'assetId',
      'serialNumberBlock',
      'unitBlockStart',
      'unitBlockEnd',
      'unitCount',
    ],
    [],
  );

  const tokenizeUnitButtonConfig = useMemo(
    () => ({
      label: intl.formatMessage({ id: 'create-token' }),
      action: item => console.log('this is my item: ', item),
    }),
    [],
  );

  return (
    <>
      <StyledSectionContainer ref={pageContainerRef}>
        <StyledHeaderContainer>
          {/* <StyledSearchContainer>
            <SearchInput
              size="large"
              onChange={() => console.log('search')}
              outline
            />
          </StyledSearchContainer> */}

          {/* <StyledFiltersContainer>
            <SelectCreatable
              options={['Ken', 'Craig', 'Michael']}
              selected={'Craig'}
              onChange={val => console.log(val)}
            />
          </StyledFiltersContainer> */}
        </StyledHeaderContainer>

        <StyledSubHeaderContainer>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label={intl.formatMessage({ id: 'untokenized-units' })} />
            <Tab label={intl.formatMessage({ id: 'existing-tokens' })} />
          </Tabs>
          <StyledCSVOperationsContainer>
            <DownloadIcon width={20} height={20} />
          </StyledCSVOperationsContainer>
        </StyledSubHeaderContainer>
        <StyledBodyContainer>
          <TabPanel value={tabValue} index={0}>
            {untokenizedUnits?.length > 0 ? (
              <DataTable
                headings={untokenizedUnitsKeysToBeDisplayed}
                data={untokenizedUnits}
                buttonConfig={tokenizeUnitButtonConfig}
                changePageTo={page => setPage(page)}
                currentPage={page}
                numberOfPages={paginationNrOfPages}
              />
            ) : (
              <NoDataMessageContainer>
                <H3>
                  <FormattedMessage id="no-untokenized-units" />
                </H3>
              </NoDataMessageContainer>
            )}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <NoDataMessageContainer>
              <H3>
                <FormattedMessage id="no-existing-tokens" />
              </H3>
            </NoDataMessageContainer>
          </TabPanel>
        </StyledBodyContainer>
      </StyledSectionContainer>
    </>
  );
};

export { CreateTokens };