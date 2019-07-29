import router from "./router";

// Server listening for request
const server = router.listen(router.get("port"), () => {
    console.log(
        "App is running on http://localhost:%d/sudoku/board in %s mode",
        router.get("port"),
        router.get("env")
    );
});

export default server;