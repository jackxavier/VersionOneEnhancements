﻿"use strict";
_kangoLoader.add("kango/browser", function(require, exports, module) {
function BrowserCookie(){this.name="",this.value="",this.domain="",this.hostOnly="",this.path="",this.secure=!1,this.httpOnly=!1,this.session=!1,this.expires=0}function BrowserBase(){EventTarget.call(this)}function BrowserTabsBase(){}function IBrowserWindow(){}function IBrowserTab(){}function getPublicApi(){return utils.createApiWrapper(module.exports,BrowserBase.prototype,IEventTarget.prototype)}var utils=require("kango/utils"),object=utils.object,array=utils.array,EventTarget=utils.EventTarget,IEventTarget=utils.IEventTarget,NotImplementedException=utils.NotImplementedException;BrowserBase.prototype=object.extend(EventTarget,{event:{DOCUMENT_COMPLETE:"DocumentComplete",BEFORE_NAVIGATE:"BeforeNavigate",TAB_CHANGED:"TabChanged",TAB_CREATED:"TabCreated",TAB_REMOVED:"TabRemoved",WINDOW_CHANGED:"WindowChanged"},getName:function(){throw new NotImplementedException},cookies:{getCookies:function(e,t){throw new NotImplementedException},getCookie:function(e,t,n){throw new NotImplementedException},setCookie:function(e,t){throw new NotImplementedException}},tabs:{},windows:{getAll:function(e){throw new NotImplementedException},getCurrent:function(e){throw new NotImplementedException},create:function(e){throw new NotImplementedException}}}),BrowserTabsBase.prototype={getAll:function(e){throw new NotImplementedException},getCurrent:function(e){throw new NotImplementedException},create:function(e){throw new NotImplementedException},broadcastMessage:function(e,t){this.getAll(function(n){array.forEach(n,function(n){n.dispatchMessage(e,t)})})}},IBrowserWindow.prototype={getId:function(){throw new NotImplementedException},getTabs:function(e){throw new NotImplementedException},getCurrentTab:function(e){throw new NotImplementedException},isActive:function(){throw new NotImplementedException}},IBrowserTab.prototype={getId:function(){throw new NotImplementedException},getUrl:function(){throw new NotImplementedException},getTitle:function(){throw new NotImplementedException},getDOMWindow:function(){throw new NotImplementedException},isActive:function(){throw new NotImplementedException},isPrivate:function(){throw new NotImplementedException},navigate:function(e){throw new NotImplementedException},activate:function(){throw new NotImplementedException},dispatchMessage:function(e,t){throw new NotImplementedException},close:function(){throw new NotImplementedException}};







function BrowserTabs(){}function Browser(){BrowserBase.call(this),this.tabs=new BrowserTabs,chrome.tabs.onActivated.addListener(func.bind(this._onTabChanged,this)),chrome.tabs.onCreated.addListener(func.bind(this._onTabCreated,this)),chrome.tabs.onRemoved.addListener(func.bind(this._onTabRemoved,this)),chrome.windows.onFocusChanged.addListener(func.bind(this._onWindowChanged,this)),chrome.webNavigation&&(chrome.webNavigation.onBeforeNavigate.addListener(func.bind(this._onBeforeNavigate,this)),chrome.webNavigation.onCompleted.addListener(func.bind(this._onNavigationCompleted,this)))}function BrowserWindow(e){this._window=e}function BrowserTab(e){this._tab=e}var utils=require("kango/utils"),func=utils.func,array=utils.array,object=utils.object;BrowserTabs.prototype=object.extend(BrowserTabsBase,{getAll:function(e){chrome.tabs.query({windowType:"normal"},function(t){e(array.map(t,function(e){return new BrowserTab(e)}))})},getCurrent:function(e){chrome.tabs.query({currentWindow:!0,active:!0},function(t){e(new BrowserTab(t[0]))})},create:function(e){var t="undefined"!=typeof e.focused?e.focused:!0;chrome.tabs.create({url:e.url,active:t})}}),Browser.prototype=object.extend(BrowserBase,{_onBeforeNavigate:function(e){0==e.frameId&&e.tabId>0&&chrome.tabs.get(e.tabId,func.bind(function(t){if(!chrome.runtime.lastError&&t){var n={url:e.url,target:new BrowserTab(t)};this.fireEvent(this.event.BEFORE_NAVIGATE,n)}},this))},_onNavigationCompleted:function(e){0==e.frameId&&e.tabId>0&&chrome.tabs.get(e.tabId,func.bind(function(t){if(!chrome.runtime.lastError&&t){var n={url:e.url,title:t.title,target:new BrowserTab(t)};this.fireEvent(this.event.DOCUMENT_COMPLETE,n)}},this))},_onTabCreated:function(e){this.fireEvent(this.event.TAB_CREATED,{tabId:e.id,target:new BrowserTab(e)})},_onTabRemoved:function(e,t){this.fireEvent(this.event.TAB_REMOVED,{tabId:e})},_onTabChanged:function(e){e.tabId>0&&chrome.tabs.get(e.tabId,func.bind(function(t){if(!chrome.runtime.lastError&&t){var n={url:t.url,title:t.title,tabId:e.tabId,target:new BrowserTab(t)};this.fireEvent(this.event.TAB_CHANGED,n)}},this))},_onWindowChanged:function(e){e>0&&chrome.windows.get(e,func.bind(function(t){!chrome.runtime.lastError&&t&&this.fireEvent(this.event.WINDOW_CHANGED,{target:new BrowserWindow(t),windowId:e})},this))},getName:function(){return"chrome"},cookies:{getCookies:function(e,t){chrome.cookies.getAll({url:e},function(e){t(array.map(e,function(e){return{name:e.name,value:e.value,domain:e.domain,hostOnly:e.hostOnly,path:e.path,secure:e.secure,httpOnly:e.httpOnly,session:e.session,expires:e.expirationDate}}))})},getCookie:function(e,t,n){chrome.cookies.get({url:e,name:t},function(e){var t=null;null!=e&&(t={name:e.name,value:e.value,domain:e.domain,hostOnly:e.hostOnly,path:e.path,secure:e.secure,httpOnly:e.httpOnly,session:e.session,expires:e.expirationDate}),n(t)})},setCookie:function(e,t){var n={url:e,name:t.name,value:t.value};"undefined"!=typeof t.expires&&(n.expirationDate=t.expires),chrome.cookies.set(n)}},windows:{getAll:function(e){chrome.windows.getAll({populate:!1},function(t){e(array.map(t,function(e){return new BrowserWindow(e)}))})},getCurrent:function(e){chrome.windows.getCurrent(function(t){e(new BrowserWindow(t))})},create:function(e){chrome.windows.create({url:e.url,type:e.type,width:e.width,height:e.height})}}}),BrowserWindow.prototype={getId:function(){return this._window.id},getTabs:function(e){chrome.tabs.query({windowId:this._window.id},function(t){e(array.map(t,function(e){return new BrowserTab(e)}))})},getCurrentTab:function(e){chrome.tabs.query({active:!0,windowId:this._window.id},function(t){e(new BrowserTab(t[0]))})},isActive:function(){return this._window.focused}},BrowserTab.prototype={getId:function(){return this._tab.id},getUrl:function(){return this._tab.url},getTitle:function(){return this._tab.title},getDOMWindow:function(){return null},isActive:function(){return this._tab.active},isPrivate:function(){return this._tab.incognito},navigate:function(e){chrome.tabs.update(this._tab.id,{url:e})},activate:function(){chrome.tabs.update(this._tab.id,{active:!0})},dispatchMessage:function(e,t){if(0!=this.getUrl().indexOf("chrome://")){var n={name:e,data:t,origin:"background",target:null,source:null,tab:{id:this.getId(),isPrivate:this.isPrivate()}};return chrome.tabs.sendMessage(this.getId(),n),!0}return!1},close:function(){chrome.tabs.remove(this.getId())}},module.exports=new Browser,module.exports.getPublicApi=getPublicApi,module.exports.BrowserTab=BrowserTab;
});