import React, { useEffect, useCallback, useRef } from 'react';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { savePreferences } from 'providers/ReduxStore/slices/app';
import StyledWrapper from './StyledWrapper';
import * as Yup from 'yup';
import debounce from 'lodash/debounce';
import toast from 'react-hot-toast';
import get from 'lodash/get';
import { BETA_FEATURES as BETA_FEATURE_IDS } from 'utils/beta-features';
import { useTranslation } from 'react-i18next';

/**
 * UI metadata for beta features rendered in Preferences.
 * IDs must match keys from utils/beta-features.js BETA_FEATURES.
 */
const BETA_FEATURES = [
  {
    id: BETA_FEATURE_IDS.OPENAPI_SYNC,
    labelKey: 'PREFERENCES.BETA.FEATURES.OPENAPI_SYNC.LABEL',
    descriptionKey: 'PREFERENCES.BETA.FEATURES.OPENAPI_SYNC.DESCRIPTION'
  }
];

const Beta = ({ close }) => {
  const { t } = useTranslation();
  const preferences = useSelector((state) => state.app.preferences);
  const dispatch = useDispatch();

  // Generate validation schema dynamically from beta features
  const generateValidationSchema = () => {
    const schemaShape = {};
    BETA_FEATURES.forEach((feature) => {
      schemaShape[feature.id] = Yup.boolean();
    });
    return Yup.object().shape(schemaShape);
  };

  // Generate initial values dynamically from beta features
  const generateInitialValues = () => {
    const initialValues = {};
    BETA_FEATURES.forEach((feature) => {
      initialValues[feature.id] = get(preferences, `beta.${feature.id}`, false);
    });
    return initialValues;
  };

  const betaSchema = generateValidationSchema();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: generateInitialValues(),
    validationSchema: betaSchema,
    onSubmit: async (values) => {
      try {
        const newPreferences = await betaSchema.validate(values, { abortEarly: true });
        handleSave(newPreferences);
      } catch (error) {
        console.error('Beta preferences validation error:', error.message);
      }
    }
  });

  const handleSave = useCallback((newBetaPreferences) => {
    dispatch(
      savePreferences({
        ...preferences,
        beta: {
          ...preferences.beta,
          ...newBetaPreferences
        }
      })
    )
      .catch((err) => console.log(err) && toast.error(t('PREFERENCES.BETA.UPDATE_FAILED')));
  }, [dispatch, preferences, t]);

  const handleSaveRef = useRef(handleSave);
  handleSaveRef.current = handleSave;

  const debouncedSave = useCallback(
    debounce((values) => {
      betaSchema.validate(values, { abortEarly: true })
        .then((validatedValues) => {
          handleSaveRef.current(validatedValues);
        })
        .catch((error) => {
        });
    }, 500),
    [betaSchema]
  );

  // Auto-save when form values change
  useEffect(() => {
    if (formik.dirty && formik.isValid) {
      debouncedSave(formik.values);
    }
    return () => {
      debouncedSave.flush();
    };
  }, [formik.values, formik.dirty, formik.isValid, debouncedSave]);

  const hasAnyBetaFeatures = BETA_FEATURES.length > 0;

  return (
    <StyledWrapper>
      <div className="section-header">{t('PREFERENCES.BETA.SECTION_TITLE')}</div>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-6">
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-wrap">
            {t('PREFERENCES.BETA.DESCRIPTION')}
          </p>
        </div>

        <div className="space-y-4">
          {BETA_FEATURES.map((feature) => (
            <div key={feature.id} className="beta-feature-item">
              <div className="flex items-center">
                <input
                  id={feature.id}
                  type="checkbox"
                  name={feature.id}
                  checked={formik.values[feature.id]}
                  onChange={formik.handleChange}
                  className="mousetrap mr-0"
                />
                <label className="block ml-2 select-none font-medium" htmlFor={feature.id}>
                  {t(feature.labelKey)}
                </label>
              </div>
              <div className="beta-feature-description ml-6 text-xs text-gray-500 dark:text-gray-400">
                {t(feature.descriptionKey)}
              </div>
            </div>
          ))}
        </div>

        {!hasAnyBetaFeatures && (
          <div className="no-features-message">
            <p>{t('PREFERENCES.BETA.NO_FEATURES')}</p>
          </div>
        )}
      </form>
    </StyledWrapper>
  );
};

export default Beta;
