using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Threading.Tasks;

namespace nodejs_dotnet
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                var server = new CommandServer();
                var task = server.Start();
                task.Wait();
            }
            catch (Exception ex)
            {
                Logger.PrintException(ex, "Main");
            }
        }
    }

    public class CommandServer
    {
        public LocalClient CurrentClient { get; private set; }
        public async Task Start()
        {
            try
            {
                var listener = new TcpListener(IPAddress.Parse("0.0.0.0"), 7776);
                listener.Start();
                while (true)
                {
                    try
                    {
                        Console.WriteLine("Listening...");
                        var client = await listener.AcceptTcpClientAsync();

                        Console.WriteLine("Client connected");
                        CurrentClient = new LocalClient(client, ReceivedMessage, ClientClosed);
                        await CurrentClient.StartReceive();
                    }
                    catch (Exception ex)
                    {
                        Logger.PrintException(ex, "Accept");
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.PrintException(ex, "Start");
            }
        }

        public void ReceivedMessage(String message)
        {
            Console.WriteLine("Client from {0}", message);
            if (CurrentClient != null)
            {
                CurrentClient.Send(message);
            }
        }

        public void ClientClosed()
        {
            CurrentClient = null;
            Console.WriteLine("Client disconnected");
            Console.WriteLine("Client Closed");
        }

        public class LocalClient
        {
            private readonly TcpClient _client;
            public TcpClient Client { get { return _client; } }

            private readonly Action _closedCallback;
            private readonly Action<string> _recvCallback;

            private readonly StreamReader _reader;
            private readonly StreamWriter _writer;

            public LocalClient(TcpClient client, Action<string> recvCallback, Action closedCallback)
            {
                _closedCallback = closedCallback;
                try
                {
                    _client = client;
                    _recvCallback = recvCallback;

                    _reader = new StreamReader(_client.GetStream());
                    _writer = new StreamWriter(_client.GetStream()) { AutoFlush = true };
                }
                catch (Exception ex)
                {
                    Logger.PrintException(ex, "LocalClient");
                }
            }

            public async Task StartReceive()
            {
                Console.WriteLine("Local client receiving...");
                try
                {
                    while (true)
                    {
                        var message = await _reader.ReadLineAsync();

                        if (String.IsNullOrEmpty(message))
                        {
                            _closedCallback();
                            Close();
                            return;
                        }

                        _recvCallback(message);
                    }
                }
                catch (Exception ex)
                {
                    Logger.PrintException(ex, "StartReceive");
                }
            }

            public void Close()
            {
                if (_reader != null)
                    _reader.Dispose();
            }

            public async void Send(string message)
            {
                try
                {
                    if (String.IsNullOrEmpty(message)) return;

                    await _writer.WriteLineAsync(message);
                }
                catch (Exception ex)
                {
                    Logger.PrintException(ex, "Send");
                }
            }
        }
    }

    public static class Logger
    {
        public static void PrintException(Exception ex, string methodName)
        {
            Console.WriteLine("{0}: \n '{1}' \n '{2}'", methodName, ex.Message, ex.StackTrace);
        }
    }
}
