import React, { forwardRef, useReducer, useEffect } from "react";

import {
  Button,
  Section,
  Hero,
  HeroBody,
  Title,
  SubTitle,
  useToggle,
  Modal,
  ModalCard,
  ModalCardBody,
  ModalCardFoot,
  ModalCardHead
} from "@brightleaf/elements";
import { usePost } from "@brightleaf/react-hooks";
import classnames from "classnames";
import { Form, TextInput, useFormElement } from "react-form-elements";
import FEATURES from './features.json'
const reducer = (state, action) => {
  console.log('state of re', state)
  console.log('action', action)
  switch (action.type) {
    case 'set':
      return { ...state, valid: false, reasons:[] }
    case 'invalid':
      return { ...state, valid: false, reasons: action.payload.reasons}
    case 'valid':
      return {
        ...state,
        valid: true,
        reasons: null,
      }
    case 'error':
      return {
        ...state,
        reasons: null,
        error: action.payload.error,
        valid: false,
      }
    default:
      return state
  }
}

const useValidation = (func, ref) => {
  const [state, dispatcher] = useReducer(reducer, { valid: true, reasons: null, })
  const el = ref.current
  useEffect(() => {
    console.info('use eff', el)

    const change = e => {
      console.log('change called')
      const validationResult = func(e.target.value)
      console.log('validationResult', validationResult)
      if (validationResult && validationResult.valid) {
        dispatcher({type: 'valid' })
        return
      }
      dispatcher({type: 'invalid', payload: validationResult })
    }
    if (el) {
       el.addEventListener('change', change)
    }
    return () => {
      if (el) {
      el.removeEventListener('change', change)
      }
    }
  }, [el, func])
  return { ...state }
}


const TextBoxRow = forwardRef(
  (
    {
      name,
      initialValue,
      label,
      type,
      className,
      labelClassName,
      inputClassName,
      controlClassName,
      children,
      ...otherProps
    },
    ref
  ) => {
    const { id, value, handleChange, inputRef } = useFormElement(
      initialValue,
      ref
    );
    const { valid, ...o } = useValidation((val) => {
      console.log('function call')
      if (val && val.length > 4) {
        return {
          valid: true
        }
      }
      return {
        valid: false,
        reasons: ['The value needs to be greater than 4 characters']
      }
    }, inputRef)

    const labelStyleProp =
      labelClassName === ""
        ? {}
        : {
            className: labelClassName
          };
    const inputStyleProp =
      inputClassName === ""
        ? {}
        : {
            className: classnames(inputClassName, {'is-danger': !valid})
          };
    const hasLabel = label.length > 0;

    console.log('valid', valid)
    console.log('state of v', o)
    return (
      <div className={classnames(`rfe-form__row`, className)}>
        {hasLabel && (
          <label htmlFor={id} {...labelStyleProp}>
            {label || ""}
          </label>
        )}
        <p className={classnames(`control`, controlClassName)}>
          <input
            type={type}
            id={id}
            ref={inputRef}
            name={name}
            onChange={handleChange}
            value={value}
            {...inputStyleProp}
            {...otherProps}
          />
          {!valid &&
          children}
        </p>
      </div>
    );
  }
);

export default function App() {
  const { data, error, loading, postData } = usePost(
    "https://kev-pi.herokuapp.com/api/echo"
  );

  console.log({ data, error, loading })
  console.log('features', FEATURES)
  const [modalShown, setModalShown] = useToggle(false);
  return (
    <>
      <Hero isPrimary isBold>
        <HeroBody>
          <Title>Hello CodeSandbox</Title>
          <SubTitle>Starting something with awesome tools!</SubTitle>
        </HeroBody>
      </Hero>

      <Section className="App">
        <Form
          name="testform"
          onSubmit={data => {
            postData(data);
            setModalShown(true);
          }}
        >
          <TextBoxRow
            name="name"
            label="Name"
            labelClassName="label"
            className="field control has-icons-left has-icons-right"
            inputClassName="input"
          >
            <>
            <span className="icon is-small is-left">
              <i className="fas fa-envelope" />
            </span>
            <span className="icon is-small is-right">
              <i className="fas fa-check" />
            </span>
            </>
          </TextBoxRow>
          <TextInput
            name="name1"
            label="Name 2"
            labelClassName="label"
            className="field control has-icons-left has-icons-right"
            inputClassName="input"
          />
          <Button isPrimary>Test</Button>
        </Form>
        <Modal
          includeTrigger={false}
          ModalType={ModalCard}
          triggerFn={setModalShown}
          isActive={modalShown}
        >
          <ModalCardHead title="ModalTitle" />
          <ModalCardBody>
            <div className="has-text-centered">
              <span className=" loader is-size-1" />
            </div>
          </ModalCardBody>
          <ModalCardFoot>
            <Button
              isSuccess
              onClick={e => {
                e.preventDefault();
                setModalShown(false);
              }}
            >
              Continue
            </Button>
            <Button
              onClick={e => {
                e.preventDefault();
                setModalShown(false);
              }}
            >
              Cancel
            </Button>
          </ModalCardFoot>
        </Modal>
      </Section>
    </>
  );
}


