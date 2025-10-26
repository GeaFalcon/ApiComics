const { useState, useEffect } = React;

function Navbar({ onNavigate, currentView }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        setUser(Auth.getUser());
    }, [currentView]);

    useEffect(() => {
        // Función para animar el selector horizontal
        function animateSelector() {
            var tabsNewAnim = $('#navbarSupportedContent');
            var activeItemNewAnim = tabsNewAnim.find('.active');

            if (activeItemNewAnim.length > 0) {
                var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
                var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
                var itemPosNewAnimTop = activeItemNewAnim.position();
                var itemPosNewAnimLeft = activeItemNewAnim.position();

                $(".hori-selector").css({
                    "top": itemPosNewAnimTop.top + "px",
                    "left": itemPosNewAnimLeft.left + "px",
                    "height": activeWidthNewAnimHeight + "px",
                    "width": activeWidthNewAnimWidth + "px"
                });
            }
        }

        // Inicializar animación después de que el DOM esté listo
        setTimeout(function() {
            animateSelector();
        }, 100);

        // Evento de click en items del navbar
        $("#navbarSupportedContent").on("click", "li", function(e) {
            $('#navbarSupportedContent ul li').removeClass("active");
            $(this).addClass('active');
            var activeWidthNewAnimHeight = $(this).innerHeight();
            var activeWidthNewAnimWidth = $(this).innerWidth();
            var itemPosNewAnimTop = $(this).position();
            var itemPosNewAnimLeft = $(this).position();
            $(".hori-selector").css({
                "top": itemPosNewAnimTop.top + "px",
                "left": itemPosNewAnimLeft.left + "px",
                "height": activeWidthNewAnimHeight + "px",
                "width": activeWidthNewAnimWidth + "px"
            });
        });

        // Evento de resize
        $(window).on('resize', function() {
            setTimeout(function() { animateSelector(); }, 500);
        });

        // Evento del botón toggle
        $(".navbar-toggler").off('click').on('click', function() {
            $(".navbar-collapse").slideToggle(300);
            setTimeout(function() { animateSelector(); });
        });

        // Cleanup
        return () => {
            $(window).off('resize');
            $("#navbarSupportedContent").off("click");
            $(".navbar-toggler").off('click');
        };
    }, [currentView]);

    const handleLogout = () => {
        Auth.logout();
        onNavigate('login');
    };

    const isAuthenticated = Auth.isAuthenticated();
    const isAdmin = Auth.isAdmin();

    // Función para determinar si un item está activo
    const getActiveClass = (view) => {
        return currentView === view ? 'active' : '';
    };

    return (
        <nav className="navbar navbar-expand-custom navbar-mainbg">
            <a className="navbar-brand navbar-logo" href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
                Comic Reader
            </a>
            <button className="navbar-toggler" type="button" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <i className="fas fa-bars text-white"></i>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ml-auto">
                    <div className="hori-selector">
                        <div className="left"></div>
                        <div className="right"></div>
                    </div>

                    {isAuthenticated ? (
                        <>
                            <li className={`nav-item ${getActiveClass('home')}`}>
                                <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
                                    <i className="fas fa-home"></i>Inicio
                                </a>
                            </li>
                            <li className={`nav-item ${getActiveClass('series-list')}`}>
                                <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); onNavigate('series-list'); }}>
                                    <i className="fas fa-book"></i>Series
                                </a>
                            </li>
                            <li className={`nav-item ${getActiveClass('favorites')}`}>
                                <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); onNavigate('favorites'); }}>
                                    <i className="fas fa-heart"></i>Favoritos
                                </a>
                            </li>
                            <li className={`nav-item ${getActiveClass('history')}`}>
                                <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); onNavigate('history'); }}>
                                    <i className="far fa-calendar-alt"></i>Historial
                                </a>
                            </li>
                            <li className={`nav-item ${getActiveClass('upload')}`}>
                                <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); onNavigate('upload'); }}>
                                    <i className="fas fa-upload"></i>Subir Comic
                                </a>
                            </li>
                            <li className={`nav-item ${getActiveClass('profile')}`}>
                                <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); onNavigate('profile'); }}>
                                    <i className="fas fa-user"></i>Mi Perfil
                                </a>
                            </li>
                            {isAdmin && (
                                <li className={`nav-item ${getActiveClass('admin')}`}>
                                    <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); onNavigate('admin'); }}>
                                        <i className="fas fa-cog"></i>Panel Admin
                                    </a>
                                </li>
                            )}
                            <li className="nav-item">
                                <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                                    <i className="fas fa-sign-out-alt"></i>Cerrar Sesión ({user?.username})
                                </a>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className={`nav-item ${getActiveClass('login')}`}>
                                <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>
                                    <i className="fas fa-sign-in-alt"></i>Iniciar Sesión
                                </a>
                            </li>
                            <li className={`nav-item ${getActiveClass('register')}`}>
                                <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); onNavigate('register'); }}>
                                    <i className="fas fa-user-plus"></i>Registrarse
                                </a>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}
