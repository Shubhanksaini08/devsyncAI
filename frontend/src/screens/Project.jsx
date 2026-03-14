import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../context/user.context'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import axios from '../config/axios'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket'
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js';
import { getWebContainer } from '../config/webcontainer'


function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)

            // hljs won't reprocess the element unless this attribute is removed
            ref.current.removeAttribute('data-highlighted')
        }
    }, [ props.className, props.children ])

    return <code {...props} ref={ref} />
}


const Project = () => {

    const location = useLocation()
    const navigate = useNavigate()

    const [ isSidePanelOpen, setIsSidePanelOpen ] = useState(false)
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ selectedUserId, setSelectedUserId ] = useState(new Set()) // Initialized as Set
    const [ project, setProject ] = useState(location.state?.project || {})
    const [ message, setMessage ] = useState('')
    const { user } = useContext(UserContext)
    const messageBox = React.createRef()

    const [ users, setUsers ] = useState([])
    const [ messages, setMessages ] = useState([]) // New state variable for messages
    const [ fileTree, setFileTree ] = useState({})

    const [ currentFile, setCurrentFile ] = useState(null)
    const [ openFiles, setOpenFiles ] = useState([])

    const [ webContainer, setWebContainer ] = useState(null)
    const [ iframeUrl, setIframeUrl ] = useState(null)

    const [ runProcess, setRunProcess ] = useState(null)
    const [ isRunning, setIsRunning ] = useState(false)

    const handleUserClick = (id) => {
        setSelectedUserId(prevSelectedUserId => {
            const newSelectedUserId = new Set(prevSelectedUserId);
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id);
            } else {
                newSelectedUserId.add(id);
            }

            return newSelectedUserId;
        });


    }


    function addCollaborators() {

        axios.put("/projects/add-user", {
            projectId: location.state?.project?._id,
            users: Array.from(selectedUserId)
        }).then(res => {
            console.log(res.data)
            setIsModalOpen(false)

        }).catch(err => {
            console.log(err)
        })

    }

    const send = () => {

        sendMessage('project-message', {
            message,
            sender: user
        })
        setMessages(prevMessages => [ ...prevMessages, { sender: user, message } ]) // Update messages state
        setMessage("")

    }

    function WriteAiMessage(message) {
        try {
            const messageObject = JSON.parse(message)
            return (
                <div
                    className='overflow-auto bg-slate-950 text-white rounded-sm p-2 w-full max-w-full break-words'
                >
                    {messageObject?.text ? (
                        <Markdown
                            children={messageObject.text}
                            options={{
                                overrides: {
                                    code: SyntaxHighlightedCode,
                                },
                            }}
                        />
                    ) : (
                        <p className="whitespace-pre-wrap">{String(messageObject)}</p>
                    )}
                </div>)
        } catch (error) {
            // Fallback for non-JSON or malformed AI messages
            return (
                <div className='overflow-auto bg-slate-950 text-white rounded-sm p-2 w-full max-w-full break-words'>
                    <p className="whitespace-pre-wrap">{message}</p>
                </div>
            )
        }
    }

    useEffect(() => {

        if (project?._id) initializeSocket(project._id)

        if (!webContainer) {
            getWebContainer().then(container => {
                setWebContainer(container)
                console.log("container started")
            })
        }


        receiveMessage('project-message', data => {

            console.log(data)
            
            if (data.sender._id == 'ai') {
                try {
                    const message = JSON.parse(data.message)
                    console.log(message)
                    if (message.fileTree) {
                        webContainer?.mount(message.fileTree)
                        setFileTree(message.fileTree || {})
                    }
                } catch (e) {
                    console.error("Failed to parse AI message for fileTree", e)
                }
                setMessages(prevMessages => [ ...prevMessages, data ]) // Update messages state
            } else {


                setMessages(prevMessages => [ ...prevMessages, data ]) // Update messages state
            }
        })


        if (location.state?.project?._id) {
            axios.get(`/projects/get-project/${location.state.project._id}`).then(res => {
                console.log(res.data.project)
                setProject(res.data.project)
                setFileTree(res.data.project?.fileTree || {})
            })
        }

        axios.get('/users/all').then(res => {

            setUsers(res.data.users)

        }).catch(err => {

            console.log(err)

        })

    }, [])

    function saveFileTree(ft) {
        if (!project?._id) return;
        axios.put('/projects/update-file-tree', {
            projectId: project._id,
            fileTree: ft
        }).then(res => {
            console.log(res.data)
        }).catch(err => {
            console.log(err)
        })
    }


    // Removed appendIncomingMessage and appendOutgoingMessage functions

    function scrollToBottom() {
        messageBox.current.scrollTop = messageBox.current.scrollHeight
    }

    return (
        <main className='h-screen w-screen flex bg-gray-950 text-gray-100 font-sans overflow-hidden'>
            {/* Left Panel: Chat & Collaborators */}
            <section className="left flex flex-col h-screen min-w-96 max-w-sm bg-gray-900 border-r border-gray-800 relative z-10 shadow-xl">
                <header className='flex justify-between items-center p-3 px-5 w-full bg-gray-900/95 backdrop-blur border-b border-gray-800 absolute z-20 top-0 shadow-sm'>
                    <button 
                        className='flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-md transition-colors border border-gray-700' 
                        onClick={() => setIsModalOpen(true)}
                    >
                        <i className="ri-user-add-line"></i>
                        <span>Invite</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-400 truncate max-w-32" title={project?.name}>{project?.name || 'Loading...'}</span>
                        <div className="flex items-center gap-1 bg-gray-950/50 rounded-lg p-1 border border-gray-800">
                            <button 
                                onClick={() => navigate('/dashboard')}
                                title="Back to Dashboard"
                                className="p-1.5 rounded-md transition-colors text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                            >
                                <i className="ri-home-5-line text-lg"></i>
                            </button>
                            <button 
                                onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} 
                                title="Collaborators"
                                className={`p-1.5 rounded-md transition-colors ${isSidePanelOpen ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
                            >
                                <i className="ri-group-line text-lg"></i>
                            </button>
                            <button 
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    axios.get('/users/logout').catch(err => console.log(err));
                                    navigate('/login');
                                }}
                                title="Logout"
                                className="p-1.5 rounded-md transition-colors text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                            >
                                <i className="ri-logout-box-r-line text-lg"></i>
                            </button>
                        </div>
                    </div>
                </header>

                <div className="conversation-area pt-16 pb-16 flex-grow flex flex-col h-full relative">
                    <div
                        ref={messageBox}
                        className="message-box p-4 flex-grow flex flex-col gap-4 overflow-y-auto max-h-full scrollbar-hide">
                        {(messages || []).map((msg, index) => {
                            const isAi = msg?.sender?._id === 'ai';
                            const isMe = msg?.sender?._id === user?._id?.toString();
                            return (
                                <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                    <small className='mb-1 text-xs text-gray-500 flex items-center gap-1'>
                                        {isAi ? <i className="ri-robot-2-fill text-indigo-400"></i> : <i className="ri-user-smile-line"></i>}
                                        {isAi ? 'DevSync AI' : (isMe ? 'You' : (msg?.sender?.email?.split('@')[0] || 'User'))}
                                    </small>
                                    <div className={`
                                        text-sm p-3 rounded-2xl max-w-[85%] shadow-sm
                                        ${isAi ? 'bg-gray-800 border border-gray-700 text-gray-200 rounded-tl-none' : ''}
                                        ${isMe ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-500/10' : ''}
                                        ${!isAi && !isMe ? 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700' : ''}
                                    `}>
                                        {isAi ? WriteAiMessage(msg.message) : <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="inputField w-full flex items-center gap-2 p-3 absolute bottom-0 bg-gray-900 border-t border-gray-800">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && message.trim() && send()}
                            className='flex-grow p-2.5 px-4 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-gray-500' 
                            type="text" 
                            placeholder='Message area...' 
                        />
                        <button
                            onClick={send}
                            disabled={!message.trim()}
                            className='p-2.5 aspect-square rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-blue-500/20'>
                            <i className="ri-send-plane-fill"></i>
                        </button>
                    </div>
                </div>

                {/* Collaborators Side Panel */}
                <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-gray-900 border-r border-gray-800 absolute z-30 transition-transform duration-300 ease-in-out ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0`}>
                    <header className='flex justify-between items-center px-5 py-4 border-b border-gray-800 bg-gray-900'>
                        <h1 className='font-semibold text-gray-100 flex items-center gap-2'>
                            <i className="ri-group-line text-blue-400"></i> Project Team
                        </h1>
                        <button onClick={() => setIsSidePanelOpen(false)} className='p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors'>
                            <i className="ri-close-line text-xl"></i>
                        </button>
                    </header>
                    <div className="users flex flex-col p-2 gap-1 overflow-y-auto">
                        {(project?.users || []).map((u, i) => (
                            <div key={u?._id || i} className="user p-3 flex gap-3 items-center rounded-lg hover:bg-gray-800 transition-colors">
                                <div className='w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 flex items-center justify-center text-gray-300 font-bold'>
                                    {u?.email ? u.email[0].toUpperCase() : '?'}
                                </div>
                                <div className="flex flex-col">
                                    <h1 className='font-medium text-sm text-gray-200'>{u.email}</h1>
                                    {u._id === user._id && <span className="text-xs text-blue-400">You</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Right Panel: Explorer & Editor */}
            <section className="right flex-grow h-full flex flex-col sm:flex-row overflow-hidden bg-gray-950">
                {/* File Explorer */}
                <div className="explorer h-full w-full sm:w-64 sm:min-w-56 bg-gray-900/50 border-r border-gray-800 flex flex-col">
                    <div className="px-4 py-3 border-b border-gray-800 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <i className="ri-folder-open-line"></i> Files
                    </div>
                    <div className="file-tree w-full p-2 overflow-y-auto flex-grow">
                        {!fileTree || Object.keys(fileTree).length === 0 ? (
                            <div className="text-center p-4 text-sm text-gray-500 mt-4">
                                No files yet. Ask the AI to generate some!
                            </div>
                        ) : (
                            Object.keys(fileTree).map((file, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentFile(file)
                                        setOpenFiles(prev => Array.from(new Set([...prev, file])))
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 text-sm transition-colors mb-1
                                        ${currentFile === file ? 'bg-blue-500/10 text-blue-400' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                                >
                                    <i className={`ri-file-${file.includes('.') ? file.split('.').pop() : 'text'}-line`}></i>
                                    <span className="truncate">{file}</span>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Code/Preview Area */}
                <div className="code-editor flex flex-col flex-grow h-full min-w-0 bg-gray-950">
                    {/* Editor Tabs & Actions */}
                    <div className="top flex flex-col md:flex-row justify-between w-full border-b border-gray-800 bg-gray-900/40">
                        <div className="files flex overflow-x-auto scrollbar-hide">
                            {(openFiles || []).length === 0 && (
                                <div className="px-4 py-3 text-sm text-gray-500 italic">Select a file to edit</div>
                            )}
                            {(openFiles || []).map((file, index) => (
                                <div key={index} className={`
                                    group flex items-center gap-2 px-4 py-2.5 min-w-[120px] max-w-[200px] cursor-pointer text-sm border-r border-gray-800 transition-colors
                                    ${currentFile === file ? 'bg-gray-950 text-blue-400 border-t-2 border-t-blue-500' : 'text-gray-400 hover:bg-gray-800/80 hover:text-gray-200 border-t-2 border-t-transparent'}
                                `} onClick={() => setCurrentFile(file)}>
                                    <i className="ri-file-code-line"></i>
                                    <span className="truncate font-medium">{file}</span>
                                    <button 
                                        className="ml-auto opacity-0 group-hover:opacity-100 hover:text-red-400 p-0.5 rounded transition-all"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const newOpen = openFiles.filter(f => f !== file);
                                            setOpenFiles(newOpen);
                                            if (currentFile === file) {
                                                setCurrentFile(newOpen.length > 0 ? newOpen[newOpen.length - 1] : null);
                                            }
                                        }}
                                    >
                                        <i className="ri-close-line"></i>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="actions flex items-center p-2 gap-2 border-l border-gray-800">
                            <button
                                onClick={async () => {
                                    if (!webContainer) return;
                                    setIsRunning(true);
                                    setIframeUrl(null);
                                    
                                    try {
                                        await webContainer.mount(fileTree);
                                        
                                        const fileNames = Object.keys(fileTree);
                                        const hasPackageJson = fileNames.includes('package.json');
                                        const hasIndexHtml = fileNames.includes('index.html');

                                        if (runProcess) {
                                            runProcess.kill();
                                            setRunProcess(null);
                                        }

                                        if (hasPackageJson) {
                                            const pkg = JSON.parse(fileTree['package.json'].file.contents);
                                            const hasStartScript = pkg.scripts && pkg.scripts.start;

                                            if (hasStartScript) {
                                                console.log("Node.js project with start script detected. Running npm install...");
                                                const installProcess = await webContainer.spawn("npm", ["install"]);
                                                installProcess.output.pipeTo(new WritableStream({
                                                    write(chunk) { console.log("Install:", chunk) }
                                                }));
                                                
                                                const installExitCode = await installProcess.exit;
                                                if (installExitCode !== 0) {
                                                    console.error("Installation failed");
                                                    setIsRunning(false);
                                                    return;
                                                }

                                                console.log("Starting application...");
                                                const tempRunProcess = await webContainer.spawn("npm", ["start"]);
                                                tempRunProcess.output.pipeTo(new WritableStream({
                                                    write(chunk) { console.log("Run:", chunk) }
                                                }));
                                                setRunProcess(tempRunProcess);
                                            } else if (hasIndexHtml) {
                                                // Fallback to static if package.json exists but no start script
                                                await runStaticServer();
                                            } else {
                                                console.log("No start script or index.html found. Attempting node app.js...");
                                                const fallback = await webContainer.spawn("node", ["app.js"]);
                                                setRunProcess(fallback);
                                            }
                                        } else if (hasIndexHtml) {
                                            await runStaticServer();
                                        } else {
                                            console.warn("No package.json or index.html found. Nothing to run.");
                                            setIsRunning(false);
                                        }

                                        async function runStaticServer() {
                                            console.log("Static HTML project detected. Serving files...");
                                            const serveScript = `
                                                const http = require('http');
                                                const fs = require('fs');
                                                const path = require('path');
                                                const server = http.createServer((req, res) => {
                                                    let filePath = '.' + req.url;
                                                    if (filePath === './') filePath = './index.html';
                                                    const extname = path.extname(filePath);
                                                    let contentType = 'text/html';
                                                    switch (extname) {
                                                        case '.js': contentType = 'text/javascript'; break;
                                                        case '.css': contentType = 'text/css'; break;
                                                        case '.json': contentType = 'application/json'; break;
                                                    }
                                                    fs.readFile(filePath, (error, content) => {
                                                        if (error) { res.writeHead(404); res.end('Not Found'); }
                                                        else { res.writeHead(200, { 'Content-Type': contentType }); res.end(content, 'utf-8'); }
                                                    });
                                                });
                                                server.listen(3000, () => console.log('Static server at 3000'));
                                            `;
                                            await webContainer.fs.writeFile('serve.js', serveScript);
                                            const serveProcess = await webContainer.spawn("node", ["serve.js"]);
                                            serveProcess.output.pipeTo(new WritableStream({
                                                write(chunk) { console.log("Serve:", chunk) }
                                            }));
                                            setRunProcess(serveProcess);
                                        }

                                        webContainer.on('server-ready', (port, url) => {
                                            console.log(`Server ready at: ${port} ${url}`);
                                            setIframeUrl(url);
                                            setIsRunning(false);
                                        });

                                    } catch (err) {
                                        console.error("Execution error:", err);
                                        setIsRunning(false);
                                    }
                                }}
                                disabled={isRunning}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border
                                    ${isRunning 
                                        ? 'bg-gray-800 text-gray-400 border-gray-700 cursor-not-allowed' 
                                        : 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border-green-500/20'}`}
                            >
                                {isRunning ? <i className="ri-loader-4-line animate-spin text-lg"></i> : <i className="ri-play-fill text-lg"></i>} 
                                {isRunning ? 'Starting...' : 'Run Code'}
                            </button>
                        </div>
                    </div>

                    {/* Editor & Preview Split */}
                    <div className="bottom flex-grow flex flex-col lg:flex-row h-full overflow-hidden">
                        {/* Editor Space */}
                        <div className={`code-editor-area relative flex-grow h-full overflow-hidden bg-gray-950 ${(isRunning || iframeUrl) ? 'lg:w-1/2' : 'w-full'}`}>
                            {currentFile && fileTree[currentFile] ? (
                                <pre className="w-full h-full overflow-auto p-4 text-sm font-mono leading-relaxed bg-transparent">
                                    <code
                                        className="outline-none block w-full h-full text-gray-300"
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => {
                                            const updatedContent = e.target.innerText;
                                            const ft = {
                                                ...fileTree,
                                                [currentFile]: { file: { contents: updatedContent } }
                                            }
                                            setFileTree(ft)
                                            saveFileTree(ft)
                                        }}
                                        dangerouslySetInnerHTML={{ __html: hljs.highlight('javascript', fileTree[currentFile].file.contents).value }}
                                        style={{ counterSet: 'line-numbering' }}
                                    />
                                </pre>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                                    <i className="ri-code-box-line text-6xl mb-4 opacity-50"></i>
                                    <p>Select a file to edit or ask AI to create one</p>
                                </div>
                            )}
                        </div>

                        {/* Preview Space */}
                        {(isRunning || iframeUrl) && (
                            <div className="preview-area flex flex-col lg:w-1/2 h-full border-t lg:border-t-0 lg:border-l border-gray-800 bg-white relative">
                                <div className="address-bar flex items-center p-2 bg-gray-900 border-b border-gray-800 gap-2">
                                    <div className="flex gap-1.5 px-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                    </div>
                                    <div className="flex-grow flex items-center bg-gray-800 rounded-md px-3 py-1.5 text-xs text-gray-400 gap-2 overflow-hidden border border-gray-700">
                                        <i className="ri-lock-line"></i>
                                        <input 
                                            type="text"
                                            onChange={(e) => setIframeUrl(e.target.value)}
                                            value={iframeUrl || 'localhost'} 
                                            className="w-full bg-transparent outline-none text-gray-200" 
                                            readOnly
                                        />
                                    </div>
                                </div>
                                
                                {iframeUrl ? (
                                    <iframe src={iframeUrl} className="w-full flex-grow bg-white border-0"></iframe>
                                ) : (
                                    <div className="w-full flex-grow flex flex-col items-center justify-center bg-gray-900 text-gray-500">
                                        {isRunning ? (
                                            <>
                                                <i className="ri-loader-4-line text-4xl animate-spin mb-4 text-blue-500"></i>
                                                <p className="text-sm">Installing packages and starting server...</p>
                                                <p className="text-xs text-gray-600 mt-2">Check browser console for detailed logs</p>
                                            </>
                                        ) : (
                                            <>
                                                <i className="ri-global-line text-4xl mb-4 opacity-50"></i>
                                                <p className="text-sm">Preview will appear here</p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Invite Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
                        <header className='flex justify-between items-center mb-6'>
                            <h2 className='text-xl font-bold text-white'>Add Collaborators</h2>
                            <button onClick={() => setIsModalOpen(false)} className='p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors'>
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </header>
                        <div className="users-list flex flex-col gap-2 mb-6 max-h-[60vh] overflow-y-auto pr-2">
                            {(users || []).map((u, i) => {
                                const isSelected = Array.from(selectedUserId).includes(u?._id);
                                return (
                                    <div 
                                        key={u?._id || i} 
                                        className={`user cursor-pointer p-3 flex gap-3 items-center border rounded-xl transition-all ${isSelected ? 'bg-blue-500/10 border-blue-500/50' : "bg-gray-800 border-gray-700 hover:border-gray-500"}`} 
                                        onClick={() => handleUserClick(u?._id)}
                                    >
                                        <div className='w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 font-bold'>
                                            {u?.email ? u.email[0].toUpperCase() : '?'}
                                        </div>
                                        <h1 className='font-medium text-gray-200 flex-grow'>{u?.email}</h1>
                                        {isSelected && <i className="ri-checkbox-circle-fill text-blue-500 text-xl"></i>}
                                    </div>
                                )
                            })}
                        </div>
                        <button
                            onClick={addCollaborators}
                            disabled={selectedUserId.size === 0}
                            className='w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium transition-colors'>
                            Invite {selectedUserId.size > 0 ? `(${selectedUserId.size})` : ''} Users
                        </button>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Project