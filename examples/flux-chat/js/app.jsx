/**
 * This file is provided by Facebook for testing and evaluation purposes
 * only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// This file bootstraps the entire application.

var ChatApp = require('./components/ChatApp.react');
var ChatExampleData = require('./ChatExampleData');
var ChatWebAPIUtils = require('./utils/ChatWebAPIUtils');
var ThreadStore = require('./stores/ThreadStore');
var MessageStore = require('./stores/MessageStore');
var React = require('react');

var threadStore = new ThreadStore();
var messageStore = new MessageStore(threadStore);

// export for http://fb.me/react-devtools
window.React = React;

React.withContext({
  threadStore: threadStore,
  messageStore: messageStore
}, function () {
  React.render(
    <ChatApp />,
    document.getElementById('react')
  );
});

// load example data into localstorage
ChatExampleData.init();
ChatWebAPIUtils.getAllMessages();
