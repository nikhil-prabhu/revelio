import {NextUIProvider} from "@nextui-org/react";

function App() {
    return (
        <NextUIProvider>
            <main className="bg-background text-foreground">
                <h1>Hello world</h1>
            </main>
        </NextUIProvider>
    );
}

export default App;
