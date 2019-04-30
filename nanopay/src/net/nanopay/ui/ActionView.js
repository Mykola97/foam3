foam.CLASS({
  package: 'net.nanopay.ui',
  name: 'ActionView',
  extends: 'foam.u2.UnstyledActionView',

  css: `
    ^ {
      border-radius: 3px;
      text-align: center;
      display: inline-block;
      padding: 9px 16px;
      background-color: %SECONDARYCOLOR%;
      color: white;
      border: 1px solid #355bc4;
    }

    ^ + ^ {
      margin-left: 8px;
    }

    ^ img {
      margin-right: 4px;
    }

    ^:focus:not(:hover) {
      border-width: 2px;
      box-shadow: 0 1px 2px 0 rgba(22, 29, 37, 0.1), inset 0 1px 0 1px rgba(255, 255, 255, 0.06);
      padding: 8px 15px;
    }

    ^:hover:not(:disabled) {
      cursor: pointer;
    }

    ^:hover:not(:disabled):not(^secondary):not(^secondary-destructive):not(^destructive) {
      border: 1px solid #294798;
      background-color: %SECONDARYHOVERCOLOR%;
    }

    ^:disabled:not(^secondary):not(^secondary-destructive):not(^destructive) {
      border: 1px solid #a7beff;
      background-color: %SECONDARYDISABLEDCOLOR%;
    }

    ^unavailable {
      display: none;
    }

    ^ img {
      vertical-align: middle;
    }

    ^.material-icons {
      cursor: pointer;
    }

    ^back {
      display: none;
    }

    ^forward {
      display: none;
    }

    ^secondary {
      border: 1px solid #cbcfd4;
      background-image: linear-gradient(to bottom, #ffffff, #e7eaec);
      color: %PRIMARYCOLOR%;
    }

    ^secondary:hover {
      border-color: #cbcfd4;
      background-image: linear-gradient(to bottom, #ffffff, #d3d6d8);
      color: %PRIMARYHOVERCOLOR%;
    }

    ^secondary:focus {
      background-image: linear-gradient(to bottom, #ffffff, #d3d6d8);
      border: 2px solid %SECONDARYCOLOR%;
      padding: 7px 15px;
    }

    ^secondary:disabled {
      border-color: #e7eaec;
      color: %PRIMARYDISABLEDCOLOR%;
    }

    ^secondary-destructive {
      border: 1px solid %DESTRUCTIVECOLOR%;
      background-color: white;
      color: %DESTRUCTIVECOLOR%;
    }

    ^secondary-destructive:hover {
      border-color: %DESTRUCTIVEHOVERCOLOR%;
      background-color: white;
      color: %DESTRUCTIVEHOVERCOLOR%;
    }

    ^secondary-destructive:disabled {
      border-color: %DESTRUCTIVEDISABLEDCOLOR%;
      color: %DESTRUCTIVEDISABLEDCOLOR%;
    }

    ^destructive {
      background-color: %DESTRUCTIVECOLOR%;
      border: 1px solid %DESTRUCTIVECOLOR%;
    }

    ^destructive:hover {
      background-color: %DESTRUCTIVEHOVERCOLOR%;
      border-color: #a61414;
    }

    ^destructive:focus {
      border: 2px solid #a61414;
      padding: 7px 15px;
      box-shadow: 0 1px 2px 0 rgba(22, 29, 37, 0.1), inset 0 1px 0 1px rgba(255, 255, 255, 0.06);
    }

    ^destructive:disabled {
      background-color: %DESTRUCTIVEDISABLEDCOLOR%;
      border-color: #ed8e8d;
    }

    /* TODO: Support buttons of different sizes */

    ^small {
      font-size: 12px;
      padding: 8px 16px;
    }

    ^small:focus:not(:hover) {
      padding: 7px 15px;
    }

    ^medium {
      font-size: 14px;
      padding: 9px 16px;
    }

    ^medium:focus:not(:hover) {
      padding: 8px 15px;
    }

    ^large {
      font-size: 16px;
      padding: 10px 16px;
    }

    ^large:focus:not(:hover) {
      padding: 9px 15px;
    }
  `
});
