import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createSelector } from 'reselect';
import { fetchTranslations, saveDimensions, setIsSidebarVisible } from 'Store/Actions/appActions';
import { fetchCustomFilters } from 'Store/Actions/customFilterActions';
import { fetchMovies } from 'Store/Actions/movieActions';
import { fetchMovieCollections } from 'Store/Actions/movieCollectionActions';
import { fetchImportLists, fetchIndexerFlags, fetchLanguages, fetchQualityProfiles, fetchUISettings } from 'Store/Actions/settingsActions';
import { fetchStatus } from 'Store/Actions/systemActions';
import { fetchTags } from 'Store/Actions/tagActions';
import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
import ErrorPage from './ErrorPage';
import LoadingPage from './LoadingPage';
import Page from './Page';

function testLocalStorage() {
  const key = 'radarrTest';

  try {
    localStorage.setItem(key, key);
    localStorage.removeItem(key);

    return true;
  } catch (e) {
    return false;
  }
}

const selectAppProps = createSelector(
  (state) => state.app.isSidebarVisible,
  (state) => state.app.version,
  (state) => state.app.isUpdated,
  (state) => state.app.isDisconnected,
  (isSidebarVisible, version, isUpdated, isDisconnected) => {
    return {
      isSidebarVisible,
      version,
      isUpdated,
      isDisconnected
    };
  }
);

const selectIsPopulated = createSelector(
  (state) => state.customFilters.isPopulated,
  (state) => state.tags.isPopulated,
  (state) => state.settings.ui.isPopulated,
  (state) => state.settings.qualityProfiles.isPopulated,
  (state) => state.settings.languages.isPopulated,
  (state) => state.settings.indexerFlags.isPopulated,
  (state) => state.settings.importLists.isPopulated,
  (state) => state.system.status.isPopulated,
  (state) => state.movieCollections.isPopulated,
  (state) => state.app.translations.isPopulated,
  (
    customFiltersIsPopulated,
    tagsIsPopulated,
    uiSettingsIsPopulated,
    qualityProfilesIsPopulated,
    languagesIsPopulated,
    indexerFlagsIsPopulated,
    importListsIsPopulated,
    systemStatusIsPopulated,
    movieCollectionsIsPopulated,
    translationsIsPopulated
  ) => {
    return (
      customFiltersIsPopulated &&
      tagsIsPopulated &&
      uiSettingsIsPopulated &&
      qualityProfilesIsPopulated &&
      languagesIsPopulated &&
      indexerFlagsIsPopulated &&
      importListsIsPopulated &&
      systemStatusIsPopulated &&
      movieCollectionsIsPopulated &&
      translationsIsPopulated
    );
  }
);

const selectErrors = createSelector(
  (state) => state.customFilters.error,
  (state) => state.tags.error,
  (state) => state.settings.ui.error,
  (state) => state.settings.qualityProfiles.error,
  (state) => state.settings.languages.error,
  (state) => state.settings.indexerFlags.error,
  (state) => state.settings.importLists.error,
  (state) => state.system.status.error,
  (state) => state.movieCollections.error,
  (state) => state.app.translations.error,
  (
    customFiltersError,
    tagsError,
    uiSettingsError,
    qualityProfilesError,
    languagesError,
    indexerFlagsError,
    importListsError,
    systemStatusError,
    movieCollectionsError,
    translationsError
  ) => {
    const hasError = !!(
      customFiltersError ||
      tagsError ||
      uiSettingsError ||
      qualityProfilesError ||
      languagesError ||
      indexerFlagsError ||
      importListsError ||
      systemStatusError ||
      movieCollectionsError ||
      translationsError
    );

    return {
      hasError,
      customFiltersError,
      tagsError,
      uiSettingsError,
      qualityProfilesError,
      languagesError,
      indexerFlagsError,
      importListsError,
      systemStatusError,
      movieCollectionsError,
      translationsError
    };
  }
);

function createMapStateToProps() {
  return createSelector(
    (state) => state.settings.ui.item.enableColorImpairedMode,
    selectIsPopulated,
    selectErrors,
    selectAppProps,
    createDimensionsSelector(),
    (
      enableColorImpairedMode,
      isPopulated,
      errors,
      app,
      dimensions
    ) => {
      return {
        ...app,
        ...errors,
        isPopulated,
        isSmallScreen: dimensions.isSmallScreen,
        enableColorImpairedMode
      };
    }
  );
}

function createMapDispatchToProps(dispatch, props) {
  return {
    dispatchFetchMovies() {
      dispatch(fetchMovies());
    },
    dispatchFetchMovieCollections() {
      dispatch(fetchMovieCollections());
    },
    dispatchFetchCustomFilters() {
      dispatch(fetchCustomFilters());
    },
    dispatchFetchTags() {
      dispatch(fetchTags());
    },
    dispatchFetchQualityProfiles() {
      dispatch(fetchQualityProfiles());
    },
    dispatchFetchLanguages() {
      dispatch(fetchLanguages());
    },
    dispatchFetchIndexerFlags() {
      dispatch(fetchIndexerFlags());
    },
    dispatchFetchImportLists() {
      dispatch(fetchImportLists());
    },
    dispatchFetchUISettings() {
      dispatch(fetchUISettings());
    },
    dispatchFetchStatus() {
      dispatch(fetchStatus());
    },
    dispatchFetchTranslations() {
      dispatch(fetchTranslations());
    },
    onResize(dimensions) {
      dispatch(saveDimensions(dimensions));
    },
    onSidebarVisibleChange(isSidebarVisible) {
      dispatch(setIsSidebarVisible({ isSidebarVisible }));
    }
  };
}

class PageConnector extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isLocalStorageSupported: testLocalStorage()
    };
  }

  componentDidMount() {
    if (!this.props.isPopulated) {
      this.props.dispatchFetchMovies();
      this.props.dispatchFetchMovieCollections();
      this.props.dispatchFetchCustomFilters();
      this.props.dispatchFetchTags();
      this.props.dispatchFetchQualityProfiles();
      this.props.dispatchFetchLanguages();
      this.props.dispatchFetchIndexerFlags();
      this.props.dispatchFetchImportLists();
      this.props.dispatchFetchUISettings();
      this.props.dispatchFetchStatus();
      this.props.dispatchFetchTranslations();
    }
  }

  //
  // Listeners

  onSidebarToggle = () => {
    this.props.onSidebarVisibleChange(!this.props.isSidebarVisible);
  };

  //
  // Render

  render() {
    const {
      isPopulated,
      hasError,
      dispatchFetchMovies,
      dispatchFetchMovieCollections,
      dispatchFetchTags,
      dispatchFetchQualityProfiles,
      dispatchFetchLanguages,
      dispatchFetchIndexerFlags,
      dispatchFetchImportLists,
      dispatchFetchUISettings,
      dispatchFetchStatus,
      dispatchFetchTranslations,
      ...otherProps
    } = this.props;

    if (hasError || !this.state.isLocalStorageSupported) {
      return (
        <ErrorPage
          {...this.state}
          {...otherProps}
        />
      );
    }

    if (isPopulated) {
      return (
        <Page
          {...otherProps}
          onSidebarToggle={this.onSidebarToggle}
        />
      );
    }

    return (
      <LoadingPage />
    );
  }
}

PageConnector.propTypes = {
  isPopulated: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  isSidebarVisible: PropTypes.bool.isRequired,
  dispatchFetchMovies: PropTypes.func.isRequired,
  dispatchFetchMovieCollections: PropTypes.func.isRequired,
  dispatchFetchCustomFilters: PropTypes.func.isRequired,
  dispatchFetchTags: PropTypes.func.isRequired,
  dispatchFetchQualityProfiles: PropTypes.func.isRequired,
  dispatchFetchLanguages: PropTypes.func.isRequired,
  dispatchFetchIndexerFlags: PropTypes.func.isRequired,
  dispatchFetchImportLists: PropTypes.func.isRequired,
  dispatchFetchUISettings: PropTypes.func.isRequired,
  dispatchFetchStatus: PropTypes.func.isRequired,
  dispatchFetchTranslations: PropTypes.func.isRequired,
  onSidebarVisibleChange: PropTypes.func.isRequired
};

export default withRouter(
  connect(createMapStateToProps, createMapDispatchToProps)(PageConnector)
);
