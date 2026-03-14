const Header = () => {
    return (
        <header className="flex justify-around items-center">
            <div className="logo">
                <h1>Logo</h1>
            </div>
            <nav>
                <ul>
                    <search>
                        <label htmlFor="search">
                            <input type="search" name="search" id="search" placeholder=""/>
                        </label>
                    </search>
                </ul>
            </nav>
        </header>
    )
}

export default Header