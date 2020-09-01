/* tslint:disable:no-any */

import { expect } from 'chai';
import sinon from 'sinon';

import { AdTypes } from '../src/types/adTypes';
import { InterstitialAdResponse } from '../src/types/responseTypes/interstitial';
import { RewardedAdResponse } from '../src/types/responseTypes/rewarded';
import { MiniApp } from '../src/miniapp';
import { MiniAppPermissionType } from '../src/MiniAppPermissionType';

const window: any = {};
(global as any).window = window;

window.MiniAppBridge = {
  getUniqueId: sinon.stub(),
  requestPermission: sinon.stub(),
  showInterstitialAd: sinon.stub(),
  showRewardedAd: sinon.stub(),
};
const miniApp = new MiniApp();

describe('getUniqueId', () => {
  it('should retrieve the unique id from the Mini App Bridge', () => {
    window.MiniAppBridge.getUniqueId.resolves('test_mini_app_id');

    return expect(miniApp.getUniqueId()).to.eventually.equal(
      'test_mini_app_id'
    );
  });
});

describe('requestPermission', () => {
  it('should delegate to requestPermission function when request any permission', () => {
    const spy = sinon.spy(miniApp, 'requestPermission' as any);

    miniApp.requestLocationPermission();

    return expect(spy.callCount).to.equal(1);
  });

  it('should retrieve location permission result from the Mini App Bridge', () => {
    window.MiniAppBridge.requestPermission.resolves('Denied');

    return expect(miniApp.requestLocationPermission()).to.eventually.equal(
      'Denied'
    );
  });
});

describe('showInterstitialAd', () => {
  it('should retrieve InterstitialAdResponse type of result from the Mini App Bridge', () => {
    const response: InterstitialAdResponse = {
      adType: AdTypes.INTERSTITIAL,
    };

    window.MiniAppBridge.showInterstitialAd.resolves(response);
    return expect(miniApp.showInterstitialAd()).to.eventually.equal(response);
  });

  it('should retrive error response from the Mini App Bridge', () => {
    const error: Error = {
      message: 'Unknown error occured',
      name: 'Bridge error',
    };

    window.MiniAppBridge.showInterstitialAd.resolves(error);
    return expect(miniApp.showInterstitialAd()).to.eventually.equal(error);
  });
});

describe('showRewardedAd', () => {
  it('should retrieve RewardedAdResponse type of result from the Mini App Bridge', () => {
    const response: RewardedAdResponse = {
      reward: { amount: 500, type: 'game bonus' },
      adType: AdTypes.REWARDED,
    };

    window.MiniAppBridge.showRewardedAd.resolves(response);
    return expect(miniApp.showRewardedAd()).to.eventually.equal(response);
  });

  it('should retrieve RewardedAdResponse type of result from the Mini App Bridge and the reward is null', () => {
    const response: RewardedAdResponse = {
      adType: AdTypes.REWARDED,
    };

    window.MiniAppBridge.showRewardedAd.resolves(response);
    return expect(miniApp.showRewardedAd()).to.eventually.equal(response);
  });

  it('should retrive error response from the Mini App Bridge', () => {
    const error: Error = {
      message: 'Unknown error occured',
      name: 'Bridge error',
    };

    window.MiniAppBridge.showRewardedAd.resolves(error);
    return expect(miniApp.showRewardedAd()).to.eventually.equal(error);
  });
});
