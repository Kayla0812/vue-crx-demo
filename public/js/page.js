/* eslint-disable */ 
(function () {
    function injectScript() {
        function getStore(modules) {
            let foundCount = 0;
            let neededObjects = [
                { id: "Store", conditions: (module) => (module.default && module.default.Chat && module.default.Msg) ? module.default : null },
                { id: "MediaCollection", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.processAttachments) ? module.default : null },
                { id: "MediaProcess", conditions: (module) => (module.BLOB) ? module : null },
                { id: "Wap", conditions: (module) => (module.createGroup) ? module : null },
                { id: "ServiceWorker", conditions: (module) => (module.default && module.default.killServiceWorker) ? module : null },
                { id: "State", conditions: (module) => (module.STATE && module.STREAM) ? module : null },
                { id: "WapDelete", conditions: (module) => (module.sendConversationDelete && module.sendConversationDelete.length == 2) ? module : null },
                { id: "Conn", conditions: (module) => (module.default && module.default.ref && module.default.refTTL) ? module.default : null },
                { id: "WapQuery", conditions: (module) => (module.default && module.default.queryExist) ? module.default : null },
                { id: "CryptoLib", conditions: (module) => (module.decryptE2EMedia) ? module : null },
                { id: "OpenChat", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.openChat) ? module.default : null },
                { id: "UserConstructor", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.isServer && module.default.prototype.isUser) ? module.default : null },
                { id: "SendTextMsgToChat", conditions: (module) => (module.sendTextMsgToChat) ? module.sendTextMsgToChat : null },
                { id: "WidFactory", conditions: (module) => (module.createUserWid) ? module : null },
                { id: "SendSeen", conditions: (module) => (module.sendSeen) ? module.sendSeen : null },
                { id: "sendDelete", conditions: (module) => (module.sendDelete) ? module.sendDelete : null },
                { id: "Cmd", conditions: function (e) { return e.Cmd ? e.Cmd : null } },
                // { id: "addAndSendMsgToChat", conditions: function (e) { return e.addAndSendMsgToChat || null } },
                { id: "Me", conditions: function (e) { return e.PLATFORMS && e.Conn ? e.default : null } },
                // { id: "Features", conditions: function (e) { return e.FEATURE_CHANGE_EVENT && e.features ? e : null } },
                // { id: "Base", conditions: function (e) { return e.setSubProtocol && e.binSend && e.actionNode ? e : null } }
            ];
            for (let idx in modules) {
                if ((typeof modules[idx] === "object") && (modules[idx] !== null)) {
                    neededObjects.forEach((needObj) => {
                        if (!needObj.conditions || needObj.foundedModule)
                            return;
                        let neededModule = needObj.conditions(modules[idx]);
                        if (neededModule !== null) {
                            foundCount++;
                            needObj.foundedModule = neededModule;
                        }
                    });

                    if (foundCount == neededObjects.length) {
                        break;
                    }
                }
            }

            let neededStore = neededObjects.find((needObj) => needObj.id === "Store");
            window.Store = neededStore.foundedModule ? neededStore.foundedModule : {};
            neededObjects.splice(neededObjects.indexOf(neededStore), 1);
            neededObjects.forEach((needObj) => {
                if (needObj.foundedModule) {
                    window.Store[needObj.id] = needObj.foundedModule;
                }
            });

            // window.Store.Chat.modelClass.prototype.sendMessage = function (e) {
            //     window.Store.SendTextMsgToChat.apply(window.Store, [this].concat([...arguments]))
            // }

            window.Store.Chat.modelClass.prototype.sendMessage = function (e) {
                window.Store.SendTextMsgToChat(this, ...arguments);
            }

            return window.Store;
        }

        return new Promise((resolve, reject) => {
            if (document.querySelector("#pane-side") !== null && (typeof webpackJsonp === 'function' || webpackChunkwhatsapp_web_client))
                if (typeof webpackJsonp === 'function') {
                    webpackJsonp([], {
                        'parasite': (x, y, z) => {
                            try {
                                getStore(z)
                                resolve()
                            } catch (error) {
                                reject(error)
                            }
                        }
                    }, ['parasite']);
                } else {
                    let tag = new Date().getTime();
                    webpackChunkwhatsapp_web_client.push([
                        ["parasite" + tag],
                        {

                        },
                        function (o, e, t) {
                            let modules = [];
                            for (let idx in o.m) {
                                let module = o(idx);
                                modules.push(module);
                            }
                            try {
                                getStore(modules)
                                resolve()
                            } catch (error) {
                                reject(error)
                            }
                        }
                    ]);
                }
            else
                reject("Page not loaded yet")
        })
    }

    var interval = setInterval(() => {
        injectScript().then(() => {
            if (!window.Store.Chat._find) {
                window.Store.Chat._findAndParse = window.Store.BusinessProfile._findAndParse;
                window.Store.Chat._find = window.Store.BusinessProfile._find;
            }

            window.TWS_WAPI = {
                lastRead: {}
            };

            window.TWS_WAPI._serializeRawObj = (obj) => {
                if (obj) {
                    let serialized = {};
                    obj = obj.toJSON ? obj.toJSON() : { ...obj };
                    for (let key in obj) {
                        if (key === "id") {
                            serialized[key] = { ...obj[key] }
                            continue;
                        }
                        if (typeof obj[key] === "object") {
                            if (!Array.isArray(obj[key])) {
                                serialized[key] = window.TWS_WAPI._serializeRawObj(obj[key])
                                continue;
                            }
                        }
                        serialized[key] = obj[key];
                    }
                    return serialized;
                }
                return {}
            };

            /**
             * Serializes a chat object
             *
             * @param rawChat Chat object
             * @returns {{}}
             */

            window.TWS_WAPI._serializeChatObj = (obj) => {
                if (obj == undefined) {
                    return null;
                }

                return Object.assign(window.TWS_WAPI._serializeRawObj(obj), {
                    kind: obj.kind,
                    isGroup: obj.isGroup,
                    contact: obj['contact'] ? window.TWS_WAPI._serializeContactObj(obj['contact']) : null,
                    groupMetadata: obj["groupMetadata"] ? window.TWS_WAPI._serializeRawObj(obj["groupMetadata"]) : null,
                    presence: obj["presence"] ? window.TWS_WAPI._serializeRawObj(obj["presence"]) : null,
                    msgs: null
                });
            };

            window.TWS_WAPI._serializeContactObj = (obj) => {
                if (obj == undefined) {
                    return null;
                }

                return Object.assign(window.TWS_WAPI._serializeRawObj(obj), {
                    formattedName: obj.formattedName,
                    displayName: obj.displayName,
                    isHighLevelVerified: obj.isHighLevelVerified,
                    isMe: obj.isMe,
                    isMyContact: obj.isMyContact,
                    isPSA: obj.isPSA,
                    isUser: obj.isUser,
                    isVerified: obj.isVerified,
                    isWAContact: obj.isWAContact,
                    profilePicThumbObj: obj.profilePicThumb ? TWS_WAPI._serializeProfilePicThumb(obj.profilePicThumb) : {},
                    statusMute: obj.statusMute,
                    msgs: null
                });
            };

            window.TWS_WAPI._serializeMessageObj = (obj) => {
                if (obj == undefined) {
                    return null;
                }

                return Object.assign(window.TWS_WAPI._serializeRawObj(obj), window.TWS_WAPI._serializeRawObj({
                    id: obj.id._serialized,
                    sender: obj["senderObj"] ? TWS_WAPI._serializeContactObj(obj["senderObj"]) : null,
                    timestamp: obj["t"],
                    content: obj["body"],
                    isGroupMsg: obj.isGroupMsg,
                    isLink: obj.isLink,
                    isMMS: obj.isMMS,
                    isMedia: obj.isMedia,
                    isNotification: obj.isNotification,
                    isPSA: obj.isPSA,
                    type: obj.type,
                    chat: TWS_WAPI._serializeChatObj(obj['chat']),
                    chatId: obj.id.remote,
                    quotedMsgObj: TWS_WAPI._serializeMessageObj(obj['_quotedMsgObj']),
                    mediaData: window.TWS_WAPI._serializeRawObj(obj['mediaData'])
                }));
            };

            window.TWS_WAPI._serializeNumberStatusObj = (obj) => {
                if (obj == undefined) {
                    return null;
                }

                return Object.assign({}, window.TWS_WAPI._serializeRawObj({
                    id: obj.jid,
                    status: obj.status,
                    isBusiness: (obj.biz === true),
                    canReceiveMessage: (obj.status === 200)
                }));
            };

            window.TWS_WAPI._serializeProfilePicThumb = (obj) => {
                if (obj == undefined) {
                    return null;
                }

                return Object.assign({}, window.TWS_WAPI._serializeRawObj({
                    eurl: obj.eurl,
                    id: obj.id,
                    img: obj.img,
                    imgFull: obj.imgFull,
                    raw: obj.raw,
                    tag: obj.tag
                }));
            }

            window.TWS_WAPI.createGroup = function (name, contactsId) {
                if (!Array.isArray(contactsId)) {
                    contactsId = [contactsId];
                }

                return window.Store.Wap.createGroup(name, contactsId);
            };

            window.TWS_WAPI.leaveGroup = function (groupId) {
                groupId = typeof groupId == "string" ? groupId : groupId._serialized;
                var group = TWS_WAPI.getChat(groupId);
                return group.sendExit()
            };


            window.TWS_WAPI.getAllContacts = function (done) {
                const contacts = window.Store.Contact.map((contact) => TWS_WAPI._serializeContactObj(contact));

                if (done !== undefined) done(contacts);
                return contacts;
            };

            /**
             * Fetches all contact objects from store, filters them
             *
             * @param done Optional callback function for async execution
             * @returns {Array|*} List of contacts
             */
            window.TWS_WAPI.getMyContacts = function (done) {
                const contacts = window.Store.Contact.filter((contact) => contact.isMyContact === true).map((contact) => TWS_WAPI._serializeContactObj(contact));
                if (done !== undefined) done(contacts);
                return contacts;
            };

            /**
             * Fetches contact object from store by ID
             *
             * @param id ID of contact
             * @param done Optional callback function for async execution
             * @returns {T|*} Contact object
             */
            window.TWS_WAPI.getContact = function (id, done) {
                const found = window.Store.Contact.get(id);

                if (done !== undefined) done(window.TWS_WAPI._serializeContactObj(found))
                return window.TWS_WAPI._serializeContactObj(found);
            };

            /**
             * Fetches all chat objects from store
             *
             * @param done Optional callback function for async execution
             * @returns {Array|*} List of chats
             */
            window.TWS_WAPI.getAllChats = function (done) {
                const chats = window.Store.Chat.map((chat) => TWS_WAPI._serializeChatObj(chat));

                if (done !== undefined) done(chats);
                return chats;
            };

            window.TWS_WAPI.haveNewMsg = function (chat) {
                return chat.unreadCount > 0;
            };

            window.TWS_WAPI.getAllChatsWithNewMsg = function (done) {
                const chats = window.Store.Chat.filter(window.TWS_WAPI.haveNewMsg).map((chat) => TWS_WAPI._serializeChatObj(chat));

                if (done !== undefined) done(chats);
                return chats;
            };

            /**
             * Fetches all chat IDs from store
             *
             * @param done Optional callback function for async execution
             * @returns {Array|*} List of chat id's
             */
            window.TWS_WAPI.getAllChatIds = function (done) {
                const chatIds = window.Store.Chat.map((chat) => chat.id._serialized || chat.id);

                if (done !== undefined) done(chatIds);
                return chatIds;
            };

            /**
             * Fetches all groups objects from store
             *
             * @param done Optional callback function for async execution
             * @returns {Array|*} List of chats
             */
            window.TWS_WAPI.getAllGroups = async function (done) {
                const groups = await Promise.all(window.Store.Chat
                    .filter((chat) => chat.isGroup)
                    .map(group => window.Store.GroupMetadata.update(group.id).then(() => {
                        let { participants } = group.groupMetadata;
                        participants = participants.map(e => e.contact).filter(e => !e.isMe).map(e => window.TWS_WAPI._serializeContactObj(e))
                        return Object.assign(window.TWS_WAPI._serializeChatObj(group), {
                            participants
                        })
                    })));
                if (done !== undefined) done(groups);
                return groups;
            };

            /**
             * Fetches all broadcasts objects from store
             *
             * @param done Optional callback function for async execution
             * @returns {Array|*} List of chats
             */
            window.TWS_WAPI.getAllBroadcasts = async function (done) {
                const broadcasts = await Promise.all(window.Store.Chat
                    .filter((chat) => chat.isBroadcast)
                    .map(group => window.Store.GroupMetadata.update(group.id).then(() => {
                        let { participants } = group.groupMetadata;
                        participants = participants.map(e => e.contact).filter(e => !e.isMe).map(e => window.TWS_WAPI._serializeContactObj(e))
                        return Object.assign(window.TWS_WAPI._serializeChatObj(group), {
                            participants
                        })
                    })))

                if (done !== undefined) done(broadcasts);
                return broadcasts;
            };

            /**
             * Fetches chat object from store by ID
             *
             * @param id ID of chat
             * @param done Optional callback function for async execution
             * @returns {T|*} Chat object
             */
            window.TWS_WAPI.getChat = function (id, done) {
                id = typeof id == "string" ? id : id._serialized;
                const found = window.Store.Chat.get(id);
                found.sendMessage = (found.sendMessage) ? found.sendMessage : function () { return window.Store.sendMessage.apply(this, arguments); };
                if (done !== undefined) done(found);
                return found;
            }

            window.TWS_WAPI.getChatByName = function (name, done) {
                const found = window.TWS_WAPI.getAllChats().find(val => val.name.includes(name))
                if (done !== undefined) done(found);
                return found;
            };

            window.TWS_WAPI.sendImageFromDatabasePicBot = function (picId, chatId, caption) {
                var chatDatabase = window.TWS_WAPI.getChatByName('DATABASEPICBOT');
                var msgWithImg = chatDatabase.msgs.find((msg) => msg.caption == picId);

                if (msgWithImg === undefined) {
                    return false;
                }
                var chatSend = TWS_WAPI.getChat(chatId);
                if (chatSend === undefined) {
                    return false;
                }
                const oldCaption = msgWithImg.caption;

                msgWithImg.id.id = window.TWS_WAPI.getNewId();
                msgWithImg.id.remote = chatId;
                msgWithImg.t = Math.ceil(new Date().getTime() / 1000);
                msgWithImg.to = chatId;

                if (caption !== undefined && caption !== '') {
                    msgWithImg.caption = caption;
                } else {
                    msgWithImg.caption = '';
                }

                msgWithImg.collection.send(msgWithImg).then(function (e) {
                    msgWithImg.caption = oldCaption;
                });

                return true;
            };

            window.TWS_WAPI.sendMessageWithThumb = function (thumb, url, title, description, text, chatId, done) {
                var chatSend = TWS_WAPI.getChat(chatId);
                if (chatSend === undefined) {
                    if (done !== undefined) done(false);
                    return false;
                }
                var linkPreview = {
                    canonicalUrl: url,
                    description: description,
                    matchedText: url,
                    title: title,
                    thumbnail: thumb,
                    compose: true
                };
                chatSend.sendMessage(text, {
                    linkPreview: linkPreview,
                    mentionedJidList: [],
                    quotedMsg: null,
                    quotedMsgAdminGroupJid: null
                });
                if (done !== undefined) done(true);
                return true;
            };

            window.TWS_WAPI.getNewId = function () {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (var i = 0; i < 20; i++)
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                return text;
            };

            window.TWS_WAPI.getChatById = function (id, done) {
                let found = TWS_WAPI.getChat(id);
                if (found) {
                    found = TWS_WAPI._serializeChatObj(found);
                } else {
                    found = false;
                }

                if (done !== undefined) done(found);
                return found;
            };


            /**
             * I return all unread messages from an asked chat and mark them as read.
             *
             * :param id: chat id
             * :type  id: string
             *
             * :param includeMe: indicates if user messages have to be included
             * :type  includeMe: boolean
             *
             * :param includeNotifications: indicates if notifications have to be included
             * :type  includeNotifications: boolean
             *
             * :param done: callback passed by selenium
             * :type  done: function
             *
             * :returns: list of unread messages from asked chat
             * :rtype: object
             */
            window.TWS_WAPI.getUnreadMessagesInChat = function (id, includeMe, includeNotifications, done) {
                // get chat and its messages
                let chat = TWS_WAPI.getChat(id);
                let messages = chat.msgs._models;

                // initialize result list
                let output = [];

                // look for unread messages, newest is at the end of array
                for (let i = messages.length - 1; i >= 0; i--) {
                    // system message: skip it
                    if (i === "remove") {
                        continue;
                    }

                    // get message
                    let messageObj = messages[i];

                    // found a read message: stop looking for others
                    if (typeof (messageObj.isNewMsg) !== "boolean" || messageObj.isNewMsg === false) {
                        continue;
                    } else {
                        messageObj.isNewMsg = false;
                        // process it
                        let message = TWS_WAPI.processMessageObj(messageObj,
                            includeMe,
                            includeNotifications);

                        // save processed message on result list
                        if (message)
                            output.push(message);
                    }
                }
                // callback was passed: run it
                if (done !== undefined) done(output);
                // return result list
                return output;
            };


            /**
             * Load more messages in chat object from store by ID
             *
             * @param id ID of chat
             * @param done Optional callback function for async execution
             * @returns None
             */
            window.TWS_WAPI.loadEarlierMessages = function (id, done) {
                const found = TWS_WAPI.getChat(id);
                if (done !== undefined) {
                    found.loadEarlierMsgs().then(function () {
                        done()
                    });
                } else {
                    found.loadEarlierMsgs();
                }
            };

            /**
             * Load more messages in chat object from store by ID
             *
             * @param id ID of chat
             * @param done Optional callback function for async execution
             * @returns None
             */
            window.TWS_WAPI.loadAllEarlierMessages = function (id, done) {
                const found = TWS_WAPI.getChat(id);
                x = function () {
                    if (!found.msgs.msgLoadState.noEarlierMsgs) {
                        found.loadEarlierMsgs().then(x);
                    } else if (done) {
                        done();
                    }
                };
                x();
            };

            window.TWS_WAPI.asyncLoadAllEarlierMessages = function (id, done) {
                done();
                window.TWS_WAPI.loadAllEarlierMessages(id);
            };

            window.TWS_WAPI.areAllMessagesLoaded = function (id, done) {
                const found = TWS_WAPI.getChat(id);
                if (!found.msgs.msgLoadState.noEarlierMsgs) {
                    if (done) done(false);
                    return false
                }
                if (done) done(true);
                return true
            };

            /**
             * Load more messages in chat object from store by ID till a particular date
             *
             * @param id ID of chat
             * @param lastMessage UTC timestamp of last message to be loaded
             * @param done Optional callback function for async execution
             * @returns None
             */

            window.TWS_WAPI.loadEarlierMessagesTillDate = function (id, lastMessage, done) {
                const found = TWS_WAPI.getChat(id);
                x = function () {
                    if (found.msgs.models[0].t > lastMessage && !found.msgs.msgLoadState.noEarlierMsgs) {
                        found.loadEarlierMsgs().then(x);
                    } else {
                        done();
                    }
                };
                x();
            };


            /**
             * Fetches all group metadata objects from store
             *
             * @param done Optional callback function for async execution
             * @returns {Array|*} List of group metadata
             */
            window.TWS_WAPI.getAllGroupMetadata = function (done) {
                const groupData = window.Store.GroupMetadata.map((groupData) => groupData.all);

                if (done !== undefined) done(groupData);
                return groupData;
            };

            /**
             * Fetches group metadata object from store by ID
             *
             * @param id ID of group
             * @param done Optional callback function for async execution
             * @returns {T|*} Group metadata object
             */
            window.TWS_WAPI.getGroupMetadata = async function (id, done) {
                let output = window.Store.GroupMetadata.get(id);

                if (output !== undefined) {
                    if (output.stale) {
                        await window.Store.GroupMetadata.update(id);
                    }
                }

                if (done !== undefined) done(output);
                return output;

            };


            /**
             * Fetches group participants
             *
             * @param id ID of group
             * @returns {Promise.<*>} Yields group metadata
             * @private
             */
            window.TWS_WAPI._getGroupParticipants = async function (id) {
                const metadata = await TWS_WAPI.getGroupMetadata(id);
                return metadata.participants;
            };

            /**
             * Fetches IDs of group participants
             *
             * @param id ID of group
             * @param done Optional callback function for async execution
             * @returns {Promise.<Array|*>} Yields list of IDs
             */
            window.TWS_WAPI.getGroupParticipantIDs = async function (id, done) {
                const output = (await TWS_WAPI._getGroupParticipants(id))
                    .map((participant) => participant.id);

                if (done !== undefined) done(output);
                return output;
            };

            window.TWS_WAPI.getGroupAdmins = async function (id, done) {
                const output = (await TWS_WAPI._getGroupParticipants(id))
                    .filter((participant) => participant.isAdmin)
                    .map((admin) => admin.id);

                if (done !== undefined) done(output);
                return output;
            };

            /**
             * Gets object representing the logged in user
             *
             * @returns {Array|*|$q.all}
             */
            window.TWS_WAPI.getMe = function (done) {
                const me = window.Store.Contact.filter((contact) => contact.isMe === true).map((contact) => TWS_WAPI._serializeContactObj(contact));
                if (done !== undefined) done(me);
                return me;
            };

            window.TWS_WAPI.isLoggedIn = function (done) {
                // Contact always exists when logged in
                const isLogged = window.Store.Contact && window.Store.Contact.checksum !== undefined;

                if (done !== undefined) done(isLogged);
                return isLogged;
            };

            window.TWS_WAPI.isConnected = function (done) {
                // Phone Disconnected icon appears when phone is disconnected from the tnternet
                const isConnected = document.querySelector('*[data-icon="alert-phone"]') !== null || document.querySelector('*[data-icon="alert-computer"]') !== null ? false : true;

                if (done !== undefined) done(isConnected);
                return isConnected;
            };

            window.TWS_WAPI.processMessageObj = function (messageObj, includeMe, includeNotifications) {
                if (messageObj.isNotification) {
                    if (includeNotifications)
                        return TWS_WAPI._serializeMessageObj(messageObj);
                    else
                        return;
                    // System message
                    // (i.e. "Messages you send to this chat and calls are now secured with end-to-end encryption...")
                } else if (messageObj.id.fromMe === false || includeMe) {
                    return TWS_WAPI._serializeMessageObj(messageObj);
                }
                return;
            };

            window.TWS_WAPI.getAllMessagesInChat = function (id, includeMe, includeNotifications, done) {
                const chat = TWS_WAPI.getChat(id);
                let output = [];
                const messages = chat.msgs._models;

                for (const i in messages) {
                    if (i === "remove") {
                        continue;
                    }
                    const messageObj = messages[i];

                    let message = TWS_WAPI.processMessageObj(messageObj, includeMe, includeNotifications)
                    if (message)
                        output.push(message);
                }
                if (done !== undefined) done(output);
                return output;
            };

            window.TWS_WAPI.getAllMessageIdsInChat = function (id, includeMe, includeNotifications, done) {
                const chat = TWS_WAPI.getChat(id);
                let output = [];
                const messages = chat.msgs._models;

                for (const i in messages) {
                    if ((i === "remove")
                        || (!includeMe && messages[i].isMe)
                        || (!includeNotifications && messages[i].isNotification)) {
                        continue;
                    }
                    output.push(messages[i].id._serialized);
                }
                if (done !== undefined) done(output);
                return output;
            };

            window.TWS_WAPI.getMessageById = function (id, done) {
                let result = false;
                try {
                    let msg = window.Store.Msg.get(id);
                    if (msg) {
                        result = TWS_WAPI.processMessageObj(msg, true, true);
                    }
                } catch (err) { }

                if (done !== undefined) {
                    done(result);
                } else {
                    return result;
                }
            };

            window.TWS_WAPI.ReplyMessage = function (idMessage, message, done) {
                var messageObject = window.Store.Msg.get(idMessage);
                if (messageObject === undefined) {
                    if (done !== undefined) done(false);
                    return false;
                }
                // messageObject = messageObject.value();

                const chat = TWS_WAPI.getChat(messageObject.chat.id)
                if (chat !== undefined) {
                    if (done !== undefined) {
                        chat.sendMessage(message, {quotedMsg: messageObject}, messageObject).then(function () {
                            function sleep(ms) {
                                return new Promise(resolve => setTimeout(resolve, ms));
                            }

                            var trials = 0;

                            function check() {
                                for (let i = chat.msgs.models.length - 1; i >= 0; i--) {
                                    let msg = chat.msgs.models[i];

                                    if (!msg.senderObj.isMe || msg.body != message) {
                                        continue;
                                    }
                                    done(TWS_WAPI._serializeMessageObj(msg));
                                    return True;
                                }
                                trials += 1;
                                if (trials > 30) {
                                    done(true);
                                    return;
                                }
                                sleep(500).then(check);
                            }
                            check();
                        });
                        return true;
                    } else {
                        chat.sendMessage(message, {quotedMsg: messageObject}, messageObject);
                        return true;
                    }
                } else {
                    if (done !== undefined) done(false);
                    return false;
                }
            };

            window.TWS_WAPI.sendMessageToID = function (id, message, done) {
                try {
                    window.getContact = (id) => {
                        return Store.WapQuery.queryExist(id);
                    }
                    window.getContact(id).then(contact => {
                        if (contact.status === 404) {
                            done(true);
                        } else {
                            Store.Chat.find(contact.jid).then(chat => {
                                chat.sendMessage(message);
                                return true;
                            }).catch(reject => {
                                if (TWS_WAPI.sendMessage(id, message)) {
                                    done(true);
                                    return true;
                                } else {
                                    done(false);
                                    return false;
                                }
                            });
                        }
                    });
                } catch (e) {
                    if (window.Store.Chat.length === 0)
                        return false;

                    firstChat = Store.Chat.models[0];
                    var originalID = firstChat.id;
                    firstChat.id = typeof originalID === "string" ? id : new window.Store.UserConstructor(id, { intentionallyUsePrivateConstructor: true });
                    if (done !== undefined) {
                        firstChat.sendMessage(message).then(function () {
                            firstChat.id = originalID;
                            done(true);
                        });
                        return true;
                    } else {
                        firstChat.sendMessage(message);
                        firstChat.id = originalID;
                        return true;
                    }
                }
                if (done !== undefined) done(false);
                return false;
            }

            window.TWS_WAPI.sendMessage = function (id, message, done) {
                var chat = TWS_WAPI.getChat(id);
                if (chat !== undefined) {
                    if (done !== undefined) {
                        chat.sendMessage(message).then(function () {
                            function sleep(ms) {
                                return new Promise(resolve => setTimeout(resolve, ms));
                            }

                            var trials = 0;

                            function check() {
                                for (let i = chat.msgs.models.length - 1; i >= 0; i--) {
                                    let msg = chat.msgs.models[i];

                                    if (!msg.senderObj.isMe || msg.body != message) {
                                        continue;
                                    }
                                    done(TWS_WAPI._serializeMessageObj(msg));
                                    return True;
                                }
                                trials += 1;
                                console.log(trials);
                                if (trials > 30) {
                                    done(true);
                                    return;
                                }
                                sleep(500).then(check);
                            }
                            check();
                        });
                        return true;
                    } else {
                        chat.sendMessage(message);
                        return true;
                    }
                } else {
                    if (done !== undefined) done(false);
                    return false;
                }
            };

            window.TWS_WAPI.sendMessage2 = function (id, message, done) {
                var chat = TWS_WAPI.getChat(id);
                if (chat !== undefined) {
                    try {
                        if (done !== undefined) {
                            chat.sendMessage(message).then(function () {
                                done(true);
                            });
                        } else {
                            chat.sendMessage(message);
                        }
                        return true;
                    } catch (error) {
                        if (done !== undefined) done(false)
                        return false;
                    }
                }
                if (done !== undefined) done(false)
                return false;
            };

            window.TWS_WAPI.sendSeen = function (id, done) {
                var chat = window.TWS_WAPI.getChat(id);
                if (chat !== undefined) {
                    if (done !== undefined) {
                        if (chat.getLastMsgKeyForAction === undefined)
                            chat.getLastMsgKeyForAction = function () { };
                        Store.SendSeen(chat, false).then(function () {
                            done(true);
                        });
                        return true;
                    } else {
                        Store.SendSeen(chat, false);
                        return true;
                    }
                }
                if (done !== undefined) done();
                return false;
            };

            function isChatMessage(message) {
                if (message.isSentByMe) {
                    return false;
                }
                if (message.isNotification) {
                    return false;
                }
                if (!message.isUserCreatedType) {
                    return false;
                }
                return true;
            }


            window.TWS_WAPI.getUnreadMessages = function (includeMe, includeNotifications, use_unread_count, done) {
                const chats = window.Store.Chat.models;
                let output = [];

                for (let chat in chats) {
                    if (isNaN(chat)) {
                        continue;
                    }

                    let messageGroupObj = chats[chat];
                    let messageGroup = TWS_WAPI._serializeChatObj(messageGroupObj);

                    messageGroup.messages = [];

                    const messages = messageGroupObj.msgs._models;
                    for (let i = messages.length - 1; i >= 0; i--) {
                        let messageObj = messages[i];
                        if (typeof (messageObj.isNewMsg) != "boolean" || messageObj.isNewMsg === false) {
                            continue;
                        } else {
                            messageObj.isNewMsg = false;
                            let message = TWS_WAPI.processMessageObj(messageObj, includeMe, includeNotifications);
                            if (message) {
                                messageGroup.messages.push(message);
                            }
                        }
                    }

                    if (messageGroup.messages.length > 0) {
                        output.push(messageGroup);
                    } else { // no messages with isNewMsg true
                        if (use_unread_count) {
                            let n = messageGroupObj.unreadCount; // will use unreadCount attribute to fetch last n messages from sender
                            for (let i = messages.length - 1; i >= 0; i--) {
                                let messageObj = messages[i];
                                if (n > 0) {
                                    if (!messageObj.isSentByMe) {
                                        let message = TWS_WAPI.processMessageObj(messageObj, includeMe, includeNotifications);
                                        messageGroup.messages.unshift(message);
                                        n -= 1;
                                    }
                                } else if (n === -1) { // chat was marked as unread so will fetch last message as unread
                                    if (!messageObj.isSentByMe) {
                                        let message = TWS_WAPI.processMessageObj(messageObj, includeMe, includeNotifications);
                                        messageGroup.messages.unshift(message);
                                        break;
                                    }
                                } else { // unreadCount = 0
                                    break;
                                }
                            }
                            if (messageGroup.messages.length > 0) {
                                messageGroupObj.unreadCount = 0; // reset unread counter
                                output.push(messageGroup);
                            }
                        }
                    }
                }
                if (done !== undefined) {
                    done(output);
                }
                return output;
            };

            window.TWS_WAPI.getGroupOwnerID = async function (id, done) {
                const output = (await TWS_WAPI.getGroupMetadata(id)).owner.id;
                if (done !== undefined) {
                    done(output);
                }
                return output;

            };

            window.TWS_WAPI.getCommonGroups = async function (id, done) {
                let output = [];

                groups = await window.TWS_WAPI.getAllGroups();

                for (let idx in groups) {
                    try {
                        participants = await window.TWS_WAPI.getGroupParticipantIDs(groups[idx].id);
                        if (participants.filter((participant) => participant == id).length) {
                            output.push(groups[idx]);
                        }
                    } catch (err) {
                        console.log("Error in group:");
                        console.log(groups[idx]);
                        console.log(err);
                    }
                }

                if (done !== undefined) {
                    done(output);
                }
                return output;
            };


            window.TWS_WAPI.getProfilePicSmallFromId = function (id, done) {
                window.Store.ProfilePicThumb.find(id).then(function (d) {
                    if (d.img !== undefined) {
                        window.TWS_WAPI.downloadFileWithCredentials(d.img, done);
                    } else {
                        done(false);
                    }
                }, function (e) {
                    done(false);
                })
            };

            window.TWS_WAPI.getProfilePicFromId = function (id, done) {
                window.Store.ProfilePicThumb.find(id).then(function (d) {
                    if (d.imgFull !== undefined) {
                        window.TWS_WAPI.downloadFileWithCredentials(d.imgFull, done);
                    } else {
                        done(false);
                    }
                }, function (e) {
                    done(false);
                })
            };

            window.TWS_WAPI.downloadFileWithCredentials = function (url, done) {
                let xhr = new XMLHttpRequest();

                xhr.onload = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            let reader = new FileReader();
                            reader.readAsDataURL(xhr.response);
                            reader.onload = function (e) {
                                done(reader.result.substr(reader.result.indexOf(',') + 1))
                            };
                        } else {
                            console.error(xhr.statusText);
                        }
                    } else {
                        console.log(err);
                        done(false);
                    }
                };

                xhr.open("GET", url, true);
                xhr.withCredentials = true;
                xhr.responseType = 'blob';
                xhr.send(null);
            };


            window.TWS_WAPI.downloadFile = function (url, done) {
                let xhr = new XMLHttpRequest();


                xhr.onload = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            let reader = new FileReader();
                            reader.readAsDataURL(xhr.response);
                            reader.onload = function (e) {
                                done(reader.result.substr(reader.result.indexOf(',') + 1))
                            };
                        } else {
                            console.error(xhr.statusText);
                        }
                    } else {
                        console.log(err);
                        done(false);
                    }
                };

                xhr.open("GET", url, true);
                xhr.responseType = 'blob';
                xhr.send(null);
            };

            window.TWS_WAPI.getBatteryLevel = function (done) {
                if (window.Store.Conn.plugged) {
                    if (done !== undefined) {
                        done(100);
                    }
                    return 100;
                }
                output = window.Store.Conn.battery;
                if (done !== undefined) {
                    done(output);
                }
                return output;
            };

            window.TWS_WAPI.deleteConversation = function (chatId, done) {
                let userId = new window.Store.UserConstructor(chatId, { intentionallyUsePrivateConstructor: true });
                let conversation = TWS_WAPI.getChat(userId);

                if (!conversation) {
                    if (done !== undefined) {
                        done(false);
                    }
                    return false;
                }

                window.Store.sendDelete(conversation, false).then(() => {
                    if (done !== undefined) {
                        done(true);
                    }
                }).catch(() => {
                    if (done !== undefined) {
                        done(false);
                    }
                });

                return true;
            };

            window.TWS_WAPI.deleteMessage = function (chatId, messageArray, revoke = false, done) {
                let userId = new window.Store.UserConstructor(chatId, { intentionallyUsePrivateConstructor: true });
                let conversation = TWS_WAPI.getChat(userId);

                if (!conversation) {
                    if (done !== undefined) {
                        done(false);
                    }
                    return false;
                }

                if (!Array.isArray(messageArray)) {
                    messageArray = [messageArray];
                }
                let messagesToDelete = messageArray.map(msgId => window.Store.Msg.get(msgId));

                if (revoke) {
                    conversation.sendRevokeMsgs(messagesToDelete, conversation);
                } else {
                    conversation.sendDeleteMsgs(messagesToDelete, conversation);
                }


                if (done !== undefined) {
                    done(true);
                }

                return true;
            };

            window.TWS_WAPI.checkNumberStatus = function (id, done) {
                window.Store.WapQuery.queryExist(id).then((result) => {
                    if (done !== undefined) {
                        if (result.jid === undefined) throw 404;
                        done(window.TWS_WAPI._serializeNumberStatusObj(result));
                    }
                }).catch((e) => {
                    if (done !== undefined) {
                        done(window.TWS_WAPI._serializeNumberStatusObj({
                            status: e,
                            jid: id
                        }));
                    }
                });

                return true;
            };

            /**
             * New messages observable functions.
             */
            window.TWS_WAPI._newMessagesQueue = [];
            window.TWS_WAPI._newMessagesBuffer = (sessionStorage.getItem('saved_msgs') != null) ? JSON.parse(sessionStorage.getItem('saved_msgs')) : [];
            window.TWS_WAPI._newMessagesDebouncer = null;
            window.TWS_WAPI._newMessagesCallbacks = [];

            window.Store.Msg.off('add');
            sessionStorage.removeItem('saved_msgs');

            window.TWS_WAPI._newMessagesListener = window.Store.Msg.on('add', (newMessage) => {
                if (newMessage && newMessage.isNewMsg && !newMessage.isSentByMe) {
                    let message = window.TWS_WAPI.processMessageObj(newMessage, false, false);
                    if (message) {
                        window.TWS_WAPI._newMessagesQueue.push(message);
                        window.TWS_WAPI._newMessagesBuffer.push(message);
                    }

                    // Starts debouncer time to don't call a callback for each message if more than one message arrives
                    // in the same second
                    if (!window.TWS_WAPI._newMessagesDebouncer && window.TWS_WAPI._newMessagesQueue.length > 0) {
                        window.TWS_WAPI._newMessagesDebouncer = setTimeout(() => {
                            let queuedMessages = window.TWS_WAPI._newMessagesQueue;

                            window.TWS_WAPI._newMessagesDebouncer = null;
                            window.TWS_WAPI._newMessagesQueue = [];

                            let removeCallbacks = [];

                            window.TWS_WAPI._newMessagesCallbacks.forEach(function (callbackObj) {
                                if (callbackObj.callback !== undefined) {
                                    callbackObj.callback(queuedMessages);
                                }
                                if (callbackObj.rmAfterUse === true) {
                                    removeCallbacks.push(callbackObj);
                                }
                            });

                            // Remove removable callbacks.
                            removeCallbacks.forEach(function (rmCallbackObj) {
                                let callbackIndex = window.TWS_WAPI._newMessagesCallbacks.indexOf(rmCallbackObj);
                                window.TWS_WAPI._newMessagesCallbacks.splice(callbackIndex, 1);
                            });
                        }, 1000);
                    }
                }
            });

            window.TWS_WAPI._unloadInform = (event) => {
                // Save in the buffer the ungot unreaded messages
                window.TWS_WAPI._newMessagesBuffer.forEach((message) => {
                    Object.keys(message).forEach(key => message[key] === undefined ? delete message[key] : '');
                });
                sessionStorage.setItem("saved_msgs", JSON.stringify(window.TWS_WAPI._newMessagesBuffer));

                // Inform callbacks that the page will be reloaded.
                window.TWS_WAPI._newMessagesCallbacks.forEach(function (callbackObj) {
                    if (callbackObj.callback !== undefined) {
                        callbackObj.callback({ status: -1, message: 'page will be reloaded, wait and register callback again.' });
                    }
                });
            };

            window.addEventListener("unload", window.TWS_WAPI._unloadInform, false);
            window.addEventListener("beforeunload", window.TWS_WAPI._unloadInform, false);
            window.addEventListener("pageunload", window.TWS_WAPI._unloadInform, false);

            /**
             * Registers a callback to be called when a new message arrives the TWS_WAPI.
             * @param rmCallbackAfterUse - Boolean - Specify if the callback need to be executed only once
             * @param done - function - Callback function to be called when a new message arrives.
             * @returns {boolean}
             */
            window.TWS_WAPI.waitNewMessages = function (rmCallbackAfterUse = true, done) {
                window.TWS_WAPI._newMessagesCallbacks.push({ callback: done, rmAfterUse: rmCallbackAfterUse });
                return true;
            };

            /**
             * Reads buffered new messages.
             * @param done - function - Callback function to be called contained the buffered messages.
             * @returns {Array}
             */
            window.TWS_WAPI.getBufferedNewMessages = function (done) {
                let bufferedMessages = window.TWS_WAPI._newMessagesBuffer;
                window.TWS_WAPI._newMessagesBuffer = [];
                if (done !== undefined) {
                    done(bufferedMessages);
                }
                return bufferedMessages;
            };
            /** End new messages observable functions **/

            window.TWS_WAPI.sendImage = function (imgBase64, chatid, filename, caption, done) {
                //var idUser = new window.Store.UserConstructor(chatid);
                var idUser = new window.Store.UserConstructor(chatid, { intentionallyUsePrivateConstructor: true });
                // create new chat
                return Store.Chat.find(idUser).then((chat) => {
                    var mediaBlob = window.TWS_WAPI.base64ImageToFile(imgBase64, filename);
                    var mc = new Store.MediaCollection(chat);
                    mc.processAttachments([{ file: mediaBlob }, 1], chat, 1).then(() => {
                        var media = mc.models[0];
                        media.sendToChat(chat, { caption: caption });
                        if (done !== undefined) done(true);
                    });
                });
            }

            window.TWS_WAPI.base64ImageToFile = function (b64Data, filename) {
                var arr = b64Data.split(',');
                var mime = arr[0].match(/:(.*?);/)[1];
                var bstr = atob(arr[1]);
                var n = bstr.length;
                var u8arr = new Uint8Array(n);

                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }

                return new File([u8arr], filename, { type: mime });
            };

            /**
             * Send contact card to a specific chat using the chat ids
             *
             * @param {string} to '000000000000@c.us'
             * @param {string|array} contact '111111111111@c.us' | ['222222222222@c.us', '333333333333@c.us, ... 'nnnnnnnnnnnn@c.us']
             */
            window.TWS_WAPI.sendContact = function (to, contact) {
                if (!Array.isArray(contact)) {
                    contact = [contact];
                }
                contact = contact.map((c) => {
                    return TWS_WAPI.getChat(c).__x_contact;
                });

                if (contact.length > 1) {
                    window.TWS_WAPI.getChat(to).sendContactList(contact);
                } else if (contact.length === 1) {
                    window.TWS_WAPI.getChat(to).sendContact(contact[0]);
                }
            };

            /**
             * Create an chat ID based in a cloned one
             *
             * @param {string} chatId '000000000000@c.us'
             */
            window.TWS_WAPI.getNewMessageId = function (chatId) {
                var newMsgId = Store.Msg.models[0].__x_id.clone();

                newMsgId.fromMe = true;
                newMsgId.id = TWS_WAPI.getNewId().toUpperCase();
                newMsgId.remote = chatId;
                newMsgId._serialized = `${newMsgId.fromMe}_${newMsgId.remote}_${newMsgId.id}`

                return newMsgId;
            };

            /**
             * Send Customized VCard without the necessity of contact be a Whatsapp Contact
             *
             * @param {string} chatId '000000000000@c.us'
             * @param {object|array} vcard { displayName: 'Contact Name', vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Contact Name;;;\nEND:VCARD' } | [{ displayName: 'Contact Name 1', vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Contact Name 1;;;\nEND:VCARD' }, { displayName: 'Contact Name 2', vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Contact Name 2;;;\nEND:VCARD' }]
             */
            window.TWS_WAPI.sendVCard = function (chatId, vcard) {
                var chat = Store.Chat.get(chatId);
                var tempMsg = Object.create(Store.Msg.models.filter(msg => msg.__x_isSentByMe)[0]);
                var newId = window.TWS_WAPI.getNewMessageId(chatId);

                var extend = {
                    ack: 0,
                    id: newId,
                    local: !0,
                    self: "out",
                    t: parseInt(new Date().getTime() / 1000),
                    to: chatId,
                    isNewMsg: !0,
                };

                if (Array.isArray(vcard)) {
                    Object.assign(extend, {
                        type: "multi_vcard",
                        vcardList: vcard
                    });

                    delete extend.body;
                } else {
                    Object.assign(extend, {
                        type: "vcard",
                        subtype: vcard.displayName,
                        body: vcard.vcard
                    });

                    delete extend.vcardList;
                }

                Object.assign(tempMsg, extend);

                chat.addAndSendMsg(tempMsg);
            };
            /**
             * Block contact
             * @param {string} id '000000000000@c.us'
             * @param {*} done - function - Callback function to be called when a new message arrives.
             */
            window.TWS_WAPI.contactBlock = function (id, done) {
                const contact = window.Store.Contact.get(id);
                if (contact !== undefined) {
                    contact.setBlock(!0);
                    done(true);
                    return true;
                }
                done(false);
                return false;
            }
            /**
             * unBlock contact
             * @param {string} id '000000000000@c.us'
             * @param {*} done - function - Callback function to be called when a new message arrives.
             */
            window.TWS_WAPI.contactUnblock = function (id, done) {
                const contact = window.Store.Contact.get(id);
                if (contact !== undefined) {
                    contact.setBlock(!1);
                    done(true);
                    return true;
                }
                done(false);
                return false;
            }

            /**
             * Remove participant of Group
             * @param {*} idGroup '0000000000-00000000@g.us'
             * @param {*} idParticipant '000000000000@c.us'
             * @param {*} done - function - Callback function to be called when a new message arrives.
             */
            window.TWS_WAPI.removeParticipantGroup = function (idGroup, idParticipant, done) {
                window.Store.WapQuery.removeParticipants(idGroup, [idParticipant]).then(() => {
                    const metaDataGroup = window.Store.GroupMetadata.get(id)
                    checkParticipant = metaDataGroup.participants._index[idParticipant];
                    if (checkParticipant === undefined) {
                        done(true); return true;
                    }
                })
            }

            /**
             * Promote Participant to Admin in Group
             * @param {*} idGroup '0000000000-00000000@g.us'
             * @param {*} idParticipant '000000000000@c.us'
             * @param {*} done - function - Callback function to be called when a new message arrives.
             */
            window.TWS_WAPI.promoteParticipantAdminGroup = function (idGroup, idParticipant, done) {
                window.Store.WapQuery.promoteParticipants(idGroup, [idParticipant]).then(() => {
                    const metaDataGroup = window.Store.GroupMetadata.get(id)
                    checkParticipant = metaDataGroup.participants._index[idParticipant];
                    if (checkParticipant !== undefined && checkParticipant.isAdmin) {
                        done(true); return true;
                    }
                    done(false); return false;
                })
            }

            /**
             * Demote Admin of Group
             * @param {*} idGroup '0000000000-00000000@g.us'
             * @param {*} idParticipant '000000000000@c.us'
             * @param {*} done - function - Callback function to be called when a new message arrives.
             */
            window.TWS_WAPI.demoteParticipantAdminGroup = function (idGroup, idParticipant, done) {
                window.Store.WapQuery.demoteParticipants(idGroup, [idParticipant]).then(() => {
                    const metaDataGroup = window.Store.GroupMetadata.get(id)
                    if (metaDataGroup === undefined) {
                        done(false); return false;
                    }
                    checkParticipant = metaDataGroup.participants._index[idParticipant];
                    if (checkParticipant !== undefined && checkParticipant.isAdmin) {
                        done(false); return false;
                    }
                    done(true); return true;
                })
            }
        }).then(e => {
            clearInterval(interval);
            window.dispatchEvent(new CustomEvent('tws::page-loaded'))
        }).catch(() => { })
    }, 1000);

    async function fetchMe() {
        let me = window.TWS_WAPI.getMe();

        if (me.length === 0) {
            return setTimeout(fetchMe, 200);
        } else {
            window.dispatchEvent(new CustomEvent('tws::me-is-ready', {
                detail: { me: me[0].id.user }
            }))
        }
    }

    window.addEventListener('tws::get-me', function () {
        try {
            fetchMe();
        } catch (error) {
            // console.log(error);
        }
    })
    
    function listenMessage () {
        let newMsg = window.TWS_WAPI.getUnreadMessages();
        let unreadMsg = window.TWS_WAPI.getAllChatsWithNewMsg();
        if (newMsg.length > 0) {
            let activeId = '';
            for (let i = 0; i < window.Store.Chat.models.length; i++) {
                if (window.Store.Chat.models[i].active) {
                    activeId = window.Store.Chat.models[i].id._serialized
                    break;
                }
            }
            window.postMessage({type: 'newMessage', data: newMsg, active_chat: activeId}, '*');
        }
        window.postMessage({type: 'unreadMessage', data: unreadMsg}, '*');
        
        setTimeout(listenMessage, 3000);
    }
    setTimeout(listenMessage, 5000);

    window.addEventListener('message', function (res) {
        if (res.data.type == 'replyMsg') {
            // console.log('reply =========');
            let data = res.data.data;
            let models = window.Store.Chat.models;
            for (let i = 0; i < models.length; i++) {
                if (models[i].id._serialized == data.chartId) {
                    data.current_chat = window.Store.Chat.models[i];
                    window.Store.Chat.models[i].lastReplyId = data.templateId;
                    if (data.block) {
                        window.Store.Chat.models[i].contact.__x_isContactBlocked = true;
                        window.Store.Chat.models[i].t = window.Store.Chat.models[i].t + 1;
                        return;
                    }
                    window.Store.Chat.models[i].t = window.Store.Chat.models[i].t + 1;
                    break;
                }
            }
            if (data.type == 'quote') {
                // console.log('quote ===========');
                window.TWS_WAPI.ReplyMessage(data.id, data.content, replyBack(data));
            } else if (data.type == 'direct') {
                // console.log('direct ===========');
                window.TWS_WAPI.sendMessage(data.id, data.content, replyBack(data));
            }
        } else if (res.data.type == 'screenChats') {
            handleChats(res.data.chat_type, res.data.val);
        } else if (res.data.type == 'openChatInfo') {
            if (!res.data.val) {
                window.Store.Cmd.closeDrawerRight();
                return;
            }
            let chat = '';
            for (let i = 0; i < window.Store.Chat.models.length; i++) {
                if (window.Store.Chat.models[i].active) {
                    chat = window.Store.Chat.models[i];
                    break;
                }
            }
            if (chat) {
                window.Store.Cmd.chatInfoDrawer(chat);
            }
        } else if (res.data.type == 'filterGroups') {
            let chats = window.TWS_WAPI.getAllChats();
            let groups = [];
            chats.forEach(item => {
                if (item.kind == 'group') {
                    groups.push({
                        label: item.name,
                        value: item.id._serialized
                    })
                }
            })
            window.postMessage({type: 'getGroups', data: groups}, '*');
        }
    })

    function eventFire (el, etype) {
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent(etype, true, true, window,0, 0, 0, 0, 0, false, false, false, false, 0, null);
        el.dispatchEvent(evt);
    }

    function replyBack (data) {
        if (data.markRead) {
            window.Store.Cmd.markChatUnread(data.current_chat, 0);
        }
        if (data.archive) {
            window.Store.Cmd.archiveChat(data.current_chat, !0, !0);
        }
    }

    function handleChats(type, replyId) {
        let Store, foundPermissions;
        if (window.Store) {
            if (type == 'all') {
                window.Store.Chat.models.forEach(function(val) {
                    if (val.active) {
                        closeChatDetail(val);
                    }
                    Object.defineProperty(val, "__x_shouldAppearInList", {
                        get : function() {
                            return true;
                        },
                        set : function(config) {
                        }
                    });
                });
            } else if (type == 'unread') {
                window.Store.Chat.models.forEach(function(val) {
                    if (val.active) {
                        closeChatDetail(val);
                    }
                    Object.defineProperty(val, "__x_shouldAppearInList", {
                        get : function() {
                            return val.hasUnread && !val.mute.isMuted;
                        },
                        set : function(config) {
                        }
                    });
                });
            } else if (type == 'await_reply') {
                window.Store.Chat.models.forEach(function(val) {
                    if (val.active) {
                        closeChatDetail(val);
                    }
                    Object.defineProperty(val, "__x_shouldAppearInList", {
                        get : function() {
                            return val.lastReceivedKey.fromMe;
                        },
                        set : function(config) {
                        }
                    });
                });
            } else if (type == 'need_reply') {
                window.Store.Chat.models.forEach(function(val) {
                    if (val.active) {
                        closeChatDetail(val);
                    }
                    Object.defineProperty(val, "__x_shouldAppearInList", {
                        get : function() {
                            return !val.lastReceivedKey.fromMe;
                        },
                        set : function(config) {
                        }
                    });
                });
            } else if (type == '1v1') {
                window.Store.Chat.models.forEach(function(val) {
                    if (val.active) {
                        closeChatDetail(val);
                    }
                    Object.defineProperty(val, "__x_shouldAppearInList", {
                        get : function() {
                            return val.isUser;
                        },
                        set : function(config) {
                        }
                    });
                });
            } else if (type == 'group') {
                window.Store.Chat.models.forEach(function(val) {
                    if (val.active) {
                        closeChatDetail(val);
                    }
                    Object.defineProperty(val, "__x_shouldAppearInList", {
                        get : function() {
                            return val.isGroup;
                        },
                        set : function(config) {
                        }
                    });
                });
            } else if (type == 'broadcast') {
                window.Store.Chat.models.forEach(function(val) {
                    if (val.active) {
                        closeChatDetail(val);
                    }
                    Object.defineProperty(val, "__x_shouldAppearInList", {
                        get : function() {
                            return val.isBroadcast;
                        },
                        set : function(config) {
                        }
                    });
                });
            } else if (type == 'auto') {
                window.Store.Chat.models.forEach(function(val) {
                    if (val.active) {
                        closeChatDetail(val);
                    }
                    let custom = val.lastReplyId == replyId;
                    Object.defineProperty(val, "__x_shouldAppearInList", {
                        get : function() {
                            return custom;
                        },
                        set : function(config) {
                        }
                    });
                });
            }

            if ((null === (Store = window.Store) || void 0 === Store || null === (foundPermissions = Store.Chat) || void 0 === foundPermissions ? void 0 : foundPermissions.models.length) > 0) {
                window.Store.Chat.models[0].t = window.Store.Chat.models[0].t + 1;
            }
        }
    }

    function closeChatDetail (chat) {
        window.Store.Cmd.closeChat(chat);
        window.postMessage({type: 'getActiveChat', data: ''}, '*');
    }

    let chatDoms = document.querySelectorAll('#pane-side ._3uIPm ._3m_Xw');
    chatDoms.forEach(dom => {
        dom.addEventListener('click', () => {
            let chats = window.Store.Chat.models;
            let data;
            for (let i = 0; i < chats.length; i++) {
                if (chats[i].active) {
                    data = {};
                    data.id = chats[i].id._serialized;
                    data.name = chats[i].name ? chats[i].name : chats[i].contact.verifiedName ? chats[i].contact.verifiedName : chats[i].contact.formattedName;
                    if (chats[i].isUser) {
                        if (chats[i].id.user.length > 11) {
                            data.phone = chats[i].id.user.replace(/^(.*)(.{3})(.{4})(.{4})/, '+$1 $2 $3 $4');
                        } else if (chats[i].id.user.length == 1) {
                            data.phone = chats[i].id.user.replace(/^(.*)(.{3})(.{4})(.{4})/, '+1 $2 $3 $4');
                        } else {
                            data.phone = chats[i].id.user;
                        }
                    }
                    break;
                }
            }
            window.postMessage({type: 'getActiveChat', data}, '*');
        })
    })
})()